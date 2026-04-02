"""
支付服务层
处理支付相关的业务逻辑
"""
import uuid
import time
import hashlib
import hmac
import base64
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.payment import (
    PaymentOrder, UserMembership, MembershipPrice, PaymentConfig,
    PaymentStatus, PaymentMethod, MembershipLevel
)
from app.schemas.payment import (
    CreatePaymentRequest, CreatePaymentResponse, QueryPaymentResponse,
    PaymentInfo, MembershipPriceInfo, UserMembershipInfo
)


class PaymentService:
    """支付服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def _generate_order_no(self) -> str:
        """生成订单号"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_str = uuid.uuid4().hex[:8].upper()
        return f"PAY{timestamp}{random_str}"
    
    def get_membership_price(self, level: str) -> Optional[MembershipPrice]:
        """获取会员价格配置"""
        return self.db.query(MembershipPrice).filter(
            MembershipPrice.level == level,
            MembershipPrice.is_active == 1
        ).first()
    
    def get_membership_list(self, user_id: str) -> list:
        """获取会员列表"""
        # 获取用户当前会员等级
        user_membership = self.db.query(UserMembership).filter(
            UserMembership.user_id == user_id
        ).first()
        current_level = user_membership.level if user_membership else "free"
        
        # 获取所有激活的会员价格
        prices = self.db.query(MembershipPrice).filter(
            MembershipPrice.is_active == 1
        ).all()
        
        membership_list = []
        level_names = {
            "free": "免费会员",
            "basic": "基础会员", 
            "premium": "高级会员"
        }
        
        for price in prices:
            membership_list.append(MembershipPriceInfo(
                level=price.level,
                name=level_names.get(price.level, price.level),
                price=price.price,
                original_price=price.original_price,
                currency=price.currency,
                duration_days=price.duration_days,
                benefits=price.benefits or [],
                description=price.description,
                is_current=(price.level == current_level)
            ))
        
        return membership_list
    
    def get_user_membership(self, user_id: str) -> Optional[UserMembershipInfo]:
        """获取用户会员信息"""
        membership = self.db.query(UserMembership).filter(
            UserMembership.user_id == user_id
        ).first()
        
        if not membership:
            # 创建默认免费会员
            membership = UserMembership(
                user_id=user_id,
                level="free",
                status="active",
                total_paid_amount=0
            )
            self.db.add(membership)
            self.db.commit()
        
        level_names = {
            "free": "免费会员",
            "basic": "基础会员",
            "premium": "高级会员"
        }
        
        # 计算剩余天数
        days_remaining = None
        if membership.end_date:
            days_remaining = (membership.end_date - datetime.now()).days
            if days_remaining < 0:
                days_remaining = 0
        
        return UserMembershipInfo(
            user_id=membership.user_id,
            level=membership.level,
            level_name=level_names.get(membership.level, membership.level),
            start_date=membership.start_date,
            end_date=membership.end_date,
            status=membership.status,
            is_active=(membership.status == "active" and 
                      (not membership.end_date or membership.end_date > datetime.now())),
            days_remaining=days_remaining,
            total_paid_amount=membership.total_paid_amount
        )
    
    def create_payment(self, user_id: str, request: CreatePaymentRequest) -> CreatePaymentResponse:
        """创建支付订单"""
        try:
            # 获取会员价格
            membership_price = self.get_membership_price(request.membership_level)
            if not membership_price:
                return CreatePaymentResponse(
                    success=False,
                    message="会员等级不存在或未启用"
                )
            
            # 生成订单号
            order_no = self._generate_order_no()
            
            # 创建订单
            order = PaymentOrder(
                order_no=order_no,
                user_id=user_id,
                amount=membership_price.price,
                currency=membership_price.currency,
                description=f"购买{membership_price.level}会员",
                payment_method=request.payment_method,
                payment_status="pending",
                membership_level=request.membership_level,
                membership_duration_days=membership_price.duration_days,
                expired_at=datetime.now() + timedelta(minutes=30),  # 30分钟过期
                return_url=request.return_url
            )
            
            self.db.add(order)
            self.db.commit()
            self.db.refresh(order)
            
            # 根据支付方式生成支付参数
            if request.payment_method == PaymentMethod.WECHAT:
                payment_data = self._create_wechat_payment(order)
            elif request.payment_method == PaymentMethod.ALIPAY:
                payment_data = self._create_alipay_payment(order)
            else:
                return CreatePaymentResponse(
                    success=False,
                    message="不支持的支付方式"
                )
            
            if not payment_data:
                return CreatePaymentResponse(
                    success=False,
                    message="创建支付订单失败"
                )
            
            return CreatePaymentResponse(
                success=True,
                message="支付订单创建成功",
                data=payment_data
            )
            
        except Exception as e:
            self.db.rollback()
            return CreatePaymentResponse(
                success=False,
                message=f"创建支付订单失败: {str(e)}"
            )
    
    def _create_wechat_payment(self, order: PaymentOrder) -> Optional[Dict[str, Any]]:
        """创建微信支付订单"""
        # 这里应该调用微信支付API
        # 为了演示，返回模拟数据
        timestamp = str(int(time.time()))
        nonce_str = uuid.uuid4().hex[:16]
        prepay_id = f"wx{uuid.uuid4().hex[:16]}"
        
        # 构造支付参数
        payment_params = {
            "appId": "wx1234567890abcdef",  # 替换为实际的微信AppID
            "timeStamp": timestamp,
            "nonceStr": nonce_str,
            "package": f"prepay_id={prepay_id}",
            "signType": "RSA",
            "paySign": "mock_signature"  # 实际需要计算签名
        }
        
        # 更新订单的第三方订单号
        order.third_party_order_id = prepay_id
        self.db.commit()
        
        return {
            "order_no": order.order_no,
            "amount": order.amount,
            "payment_method": "wechat",
            "payment_params": payment_params,
            "qr_code_url": None,  # 如果是扫码支付，返回二维码URL
            "expire_time": 600  # 10分钟有效
        }
    
    def _create_alipay_payment(self, order: PaymentOrder) -> Optional[Dict[str, Any]]:
        """创建支付宝支付订单"""
        # 这里应该调用支付宝API
        # 为了演示，返回模拟数据
        out_trade_no = order.order_no
        
        # 构造支付参数
        payment_params = {
            "orderStr": f"app_id=2024XXXXXX&biz_content=mock_data&charset=utf-8&method=alipay.trade.app.pay&sign_type=RSA2&timestamp=2024-01-01 12:00:00&version=1.0&sign=mock_sign"
        }
        
        # 更新订单的第三方订单号
        order.third_party_order_id = out_trade_no
        self.db.commit()
        
        return {
            "order_no": order.order_no,
            "amount": order.amount,
            "payment_method": "alipay",
            "payment_params": payment_params,
            "qr_code_url": None,
            "expire_time": 600
        }
    
    def query_payment(self, order_no: str, user_id: str) -> QueryPaymentResponse:
        """查询支付状态"""
        try:
            order = self.db.query(PaymentOrder).filter(
                PaymentOrder.order_no == order_no,
                PaymentOrder.user_id == user_id
            ).first()
            
            if not order:
                return QueryPaymentResponse(
                    success=False,
                    message="订单不存在"
                )
            
            payment_info = PaymentInfo(
                order_no=order.order_no,
                amount=order.amount,
                currency=order.currency,
                payment_method=order.payment_method,
                payment_status=order.payment_status,
                membership_level=order.membership_level,
                created_at=order.created_at,
                paid_at=order.paid_at,
                expired_at=order.expired_at
            )
            
            return QueryPaymentResponse(
                success=True,
                message="查询成功",
                data=payment_info
            )
            
        except Exception as e:
            return QueryPaymentResponse(
                success=False,
                message=f"查询失败: {str(e)}"
            )
    
    def handle_wechat_notify(self, notify_data: Dict[str, Any]) -> bool:
        """处理微信支付回调"""
        try:
            # 验证签名
            # 解密数据
            # 解析支付结果
            
            # 获取订单号
            out_trade_no = notify_data.get("out_trade_no")
            transaction_id = notify_data.get("transaction_id")
            trade_state = notify_data.get("trade_state")
            
            order = self.db.query(PaymentOrder).filter(
                PaymentOrder.order_no == out_trade_no
            ).first()
            
            if not order:
                return False
            
            if trade_state == "SUCCESS":
                # 更新订单状态
                order.payment_status = "success"
                order.paid_at = datetime.now()
                order.third_party_response = notify_data
                
                # 更新用户会员信息
                self._update_user_membership(order)
            else:
                order.payment_status = "failed"
            
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            return False
    
    def handle_alipay_notify(self, notify_data: Dict[str, Any]) -> bool:
        """处理支付宝回调"""
        try:
            # 验证签名
            # 解析支付结果
            
            # 获取订单号
            out_trade_no = notify_data.get("out_trade_no")
            trade_no = notify_data.get("trade_no")
            trade_status = notify_data.get("trade_status")
            
            order = self.db.query(PaymentOrder).filter(
                PaymentOrder.order_no == out_trade_no
            ).first()
            
            if not order:
                return False
            
            # 支付宝交易状态: WAIT_BUYER_PAY, TRADE_CLOSED, TRADE_SUCCESS, TRADE_FINISHED
            if trade_status in ["TRADE_SUCCESS", "TRADE_FINISHED"]:
                # 更新订单状态
                order.payment_status = "success"
                order.paid_at = datetime.now()
                order.third_party_response = notify_data
                
                # 更新用户会员信息
                self._update_user_membership(order)
            elif trade_status == "TRADE_CLOSED":
                order.payment_status = "cancelled"
            
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            return False
    
    def _update_user_membership(self, order: PaymentOrder):
        """更新用户会员信息"""
        user_membership = self.db.query(UserMembership).filter(
            UserMembership.user_id == order.user_id
        ).first()
        
        now = datetime.now()
        
        if not user_membership:
            # 创建新会员记录
            user_membership = UserMembership(
                user_id=order.user_id,
                level=order.membership_level,
                start_date=now,
                end_date=now + timedelta(days=order.membership_duration_days),
                status="active",
                last_order_id=order.id,
                total_paid_amount=order.amount
            )
            self.db.add(user_membership)
        else:
            # 更新现有会员记录
            user_membership.level = order.membership_level
            user_membership.start_date = now
            user_membership.end_date = now + timedelta(days=order.membership_duration_days)
            user_membership.status = "active"
            user_membership.last_order_id = order.id
            user_membership.total_paid_amount += order.amount
        
        self.db.commit()
    
    def cancel_payment(self, order_no: str, user_id: str, reason: str = None) -> bool:
        """取消支付订单"""
        try:
            order = self.db.query(PaymentOrder).filter(
                PaymentOrder.order_no == order_no,
                PaymentOrder.user_id == user_id,
                PaymentOrder.payment_status == "pending"
            ).first()
            
            if not order:
                return False
            
            order.payment_status = "cancelled"
            order.remark = reason
            
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            return False


def get_payment_service(db: Session) -> PaymentService:
    """获取支付服务实例"""
    return PaymentService(db)
