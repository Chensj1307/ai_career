"""
支付相关路由
提供支付相关的API接口
"""
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.schemas.payment import (
    CreatePaymentRequest, CreatePaymentResponse, QueryPaymentResponse,
    CancelPaymentRequest, MembershipListResponse, UserMembershipResponse,
    PaymentNotifyResponse, WechatPayNotify, AlipayNotify
)
from app.services.payment_service import get_payment_service, PaymentService

router = APIRouter(
    prefix="/payment",
    tags=["支付"],
    responses={404: {"description": "Not found"}}
)


# 模拟用户认证，实际项目中应该使用JWT或其他认证方式
def get_current_user_id() -> str:
    """获取当前用户ID（模拟）"""
    # 实际项目中应该从token中解析用户ID
    return "user_123456"


@router.get("/membership/list", response_model=MembershipListResponse)
async def get_membership_list(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    获取会员列表
    
    返回所有可用的会员等级和价格信息
    """
    payment_service = get_payment_service(db)
    membership_list = payment_service.get_membership_list(user_id)
    
    return MembershipListResponse(
        success=True,
        message="获取会员列表成功",
        data=membership_list
    )


@router.get("/membership/my", response_model=UserMembershipResponse)
async def get_my_membership(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    获取我的会员信息
    
    返回当前登录用户的会员信息
    """
    payment_service = get_payment_service(db)
    membership_info = payment_service.get_user_membership(user_id)
    
    if not membership_info:
        return UserMembershipResponse(
            success=False,
            message="获取会员信息失败"
        )
    
    return UserMembershipResponse(
        success=True,
        message="获取会员信息成功",
        data=membership_info
    )


@router.post("/create", response_model=CreatePaymentResponse)
async def create_payment(
    request: CreatePaymentRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    创建支付订单
    
    创建一个新的支付订单，返回支付参数供前端调用支付SDK
    
    - **membership_level**: 会员等级 (free/basic/premium)
    - **payment_method**: 支付方式 (wechat/alipay)
    - **return_url**: 支付完成后跳转URL（可选）
    """
    payment_service = get_payment_service(db)
    response = payment_service.create_payment(user_id, request)
    return response


@router.get("/query/{order_no}", response_model=QueryPaymentResponse)
async def query_payment(
    order_no: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    查询支付状态
    
    根据订单号查询支付订单的状态
    
    - **order_no**: 订单号
    """
    payment_service = get_payment_service(db)
    response = payment_service.query_payment(order_no, user_id)
    return response


@router.post("/cancel")
async def cancel_payment(
    request: CancelPaymentRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    取消支付订单
    
    取消待支付的订单
    
    - **order_no**: 订单号
    - **reason**: 取消原因（可选）
    """
    payment_service = get_payment_service(db)
    success = payment_service.cancel_payment(
        request.order_no, 
        user_id, 
        request.reason
    )
    
    if success:
        return {"success": True, "message": "订单已取消"}
    else:
        return {"success": False, "message": "取消订单失败，订单可能不存在或已支付"}


# ============ 支付回调接口 ============

@router.post("/notify/wechat")
async def wechat_notify(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    微信支付回调通知
    
    微信支付完成后，微信服务器会调用此接口通知支付结果
    """
    try:
        # 获取请求体
        body = await request.body()
        notify_data = await request.json()
        
        # 处理回调（异步处理，立即返回成功响应）
        payment_service = get_payment_service(db)
        background_tasks.add_task(
            payment_service.handle_wechat_notify,
            notify_data
        )
        
        # 返回成功响应给微信服务器
        return JSONResponse(
            content={"code": "SUCCESS", "message": "成功"}
        )
        
    except Exception as e:
        # 返回失败响应
        return JSONResponse(
            content={"code": "FAIL", "message": str(e)},
            status_code=400
        )


@router.post("/notify/alipay")
async def alipay_notify(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    支付宝回调通知
    
    支付宝支付完成后，支付宝服务器会调用此接口通知支付结果
    """
    try:
        # 获取表单数据
        form_data = await request.form()
        notify_data = dict(form_data)
        
        # 处理回调（异步处理，立即返回成功响应）
        payment_service = get_payment_service(db)
        background_tasks.add_task(
            payment_service.handle_alipay_notify,
            notify_data
        )
        
        # 返回成功响应给支付宝服务器
        return "success"
        
    except Exception as e:
        # 返回失败响应
        return "fail"


@router.get("/return/wechat")
async def wechat_return(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    微信支付同步返回
    
    微信支付完成后，同步跳转的页面
    """
    # 获取查询参数
    params = dict(request.query_params)
    
    # 这里可以重定向到前端页面，或者返回HTML页面
    return {
        "success": True,
        "message": "支付完成",
        "data": params
    }


@router.get("/return/alipay")
async def alipay_return(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    支付宝同步返回
    
    支付宝支付完成后，同步跳转的页面
    """
    # 获取查询参数
    params = dict(request.query_params)
    
    # 这里可以重定向到前端页面，或者返回HTML页面
    return {
        "success": True,
        "message": "支付完成",
        "data": params
    }


# ============ 管理接口 ============

@router.get("/admin/orders")
async def get_payment_orders(
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    获取支付订单列表（管理接口）
    
    获取所有支付订单，支持分页和状态筛选
    """
    from sqlalchemy import desc
    from app.models.payment import PaymentOrder
    
    query = db.query(PaymentOrder)
    
    if status:
        query = query.filter(PaymentOrder.payment_status == status)
    
    total = query.count()
    orders = query.order_by(desc(PaymentOrder.created_at)).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    
    return {
        "success": True,
        "message": "获取订单列表成功",
        "data": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "orders": [
                {
                    "order_no": order.order_no,
                    "user_id": order.user_id,
                    "amount": order.amount,
                    "payment_method": order.payment_method,
                    "payment_status": order.payment_status,
                    "membership_level": order.membership_level,
                    "created_at": order.created_at.isoformat() if order.created_at else None,
                    "paid_at": order.paid_at.isoformat() if order.paid_at else None
                }
                for order in orders
            ]
        }
    }


@router.get("/admin/stats")
async def get_payment_stats(
    db: Session = Depends(get_db)
):
    """
    获取支付统计（管理接口）
    
    获取支付相关的统计数据
    """
    from sqlalchemy import func
    from app.models.payment import PaymentOrder, UserMembership
    
    # 订单统计
    total_orders = db.query(PaymentOrder).count()
    success_orders = db.query(PaymentOrder).filter(
        PaymentOrder.payment_status == "success"
    ).count()
    pending_orders = db.query(PaymentOrder).filter(
        PaymentOrder.payment_status == "pending"
    ).count()
    
    # 金额统计
    total_amount = db.query(func.sum(PaymentOrder.amount)).filter(
        PaymentOrder.payment_status == "success"
    ).scalar() or 0
    
    # 会员统计
    total_members = db.query(UserMembership).count()
    premium_members = db.query(UserMembership).filter(
        UserMembership.level == "premium"
    ).count()
    
    return {
        "success": True,
        "message": "获取统计数据成功",
        "data": {
            "orders": {
                "total": total_orders,
                "success": success_orders,
                "pending": pending_orders,
                "success_rate": round(success_orders / total_orders * 100, 2) if total_orders > 0 else 0
            },
            "amount": {
                "total": round(total_amount, 2)
            },
            "members": {
                "total": total_members,
                "premium": premium_members
            }
        }
    }
