"""
支付相关数据模型 (Pydantic)
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class PaymentMethod(str, Enum):
    """支付方式"""
    WECHAT = "wechat"
    ALIPAY = "alipay"


class PaymentStatus(str, Enum):
    """支付状态"""
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class MembershipLevel(str, Enum):
    """会员等级"""
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"


# ============ 请求模型 ============

class CreatePaymentRequest(BaseModel):
    """创建支付请求"""
    membership_level: MembershipLevel = Field(..., description="会员等级")
    payment_method: PaymentMethod = Field(..., description="支付方式: wechat/alipay")
    return_url: Optional[str] = Field(None, description="支付完成后跳转URL")
    
    class Config:
        json_schema_extra = {
            "example": {
                "membership_level": "premium",
                "payment_method": "wechat",
                "return_url": "http://localhost:3007/membership"
            }
        }


class QueryPaymentRequest(BaseModel):
    """查询支付状态请求"""
    order_no: str = Field(..., description="订单号")


class CancelPaymentRequest(BaseModel):
    """取消支付请求"""
    order_no: str = Field(..., description="订单号")
    reason: Optional[str] = Field(None, description="取消原因")


# ============ 响应模型 ============

class PaymentInfo(BaseModel):
    """支付信息"""
    order_no: str
    amount: float
    currency: str = "CNY"
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    membership_level: MembershipLevel
    created_at: datetime
    paid_at: Optional[datetime] = None
    expired_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class CreatePaymentResponse(BaseModel):
    """创建支付响应"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "支付订单创建成功",
                "data": {
                    "order_no": "PAY202401011200000001",
                    "amount": 19.00,
                    "payment_method": "wechat",
                    "payment_params": {
                        "appId": "wx1234567890",
                        "timeStamp": "1704096000",
                        "nonceStr": "random_string",
                        "package": "prepay_id=wx1234567890",
                        "signType": "RSA",
                        "paySign": "signature"
                    },
                    "qr_code_url": None,
                    "expire_time": 600
                }
            }
        }


class QueryPaymentResponse(BaseModel):
    """查询支付状态响应"""
    success: bool
    message: str
    data: Optional[PaymentInfo] = None


class PaymentNotifyResponse(BaseModel):
    """支付回调响应"""
    success: bool
    message: str


# ============ 会员相关模型 ============

class MembershipBenefit(BaseModel):
    """会员权益"""
    id: str
    name: str
    description: str
    available: bool


class MembershipPriceInfo(BaseModel):
    """会员价格信息"""
    level: MembershipLevel
    name: str
    price: float
    original_price: Optional[float] = None
    currency: str = "CNY"
    duration_days: int
    benefits: List[str]
    description: Optional[str] = None
    is_current: bool = False


class UserMembershipInfo(BaseModel):
    """用户会员信息"""
    user_id: str
    level: MembershipLevel
    level_name: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str
    is_active: bool
    days_remaining: Optional[int] = None
    total_paid_amount: float = 0


class MembershipListResponse(BaseModel):
    """会员列表响应"""
    success: bool
    message: str
    data: List[MembershipPriceInfo]


class UserMembershipResponse(BaseModel):
    """用户会员信息响应"""
    success: bool
    message: str
    data: Optional[UserMembershipInfo] = None


# ============ 支付配置模型 ============

class PaymentConfigInfo(BaseModel):
    """支付配置信息"""
    config_name: str
    config_type: PaymentMethod
    app_id: str
    mch_id: Optional[str] = None
    sandbox: bool = True
    is_active: bool = True
    notify_url: Optional[str] = None
    return_url: Optional[str] = None


# ============ 微信支付特定模型 ============

class WechatPayParams(BaseModel):
    """微信支付参数"""
    appId: str
    timeStamp: str
    nonceStr: str
    package: str
    signType: str
    paySign: str


class WechatPayResponse(BaseModel):
    """微信支付响应"""
    order_no: str
    amount: float
    prepay_id: str
    payment_params: WechatPayParams
    qr_code_url: Optional[str] = None
    expire_time: int = 600


# ============ 支付宝特定模型 ============

class AlipayParams(BaseModel):
    """支付宝支付参数"""
    orderStr: str


class AlipayResponse(BaseModel):
    """支付宝支付响应"""
    order_no: str
    amount: float
    out_trade_no: str
    payment_params: AlipayParams
    qr_code_url: Optional[str] = None
    expire_time: int = 600


# ============ 回调通知模型 ============

class WechatPayNotify(BaseModel):
    """微信支付回调通知"""
    id: str
    create_time: str
    resource_type: str
    event_type: str
    summary: str
    resource: Dict[str, Any]


class AlipayNotify(BaseModel):
    """支付宝回调通知"""
    notify_time: str
    notify_type: str
    notify_id: str
    app_id: str
    charset: str
    version: str
    sign_type: str
    sign: str
    trade_no: str
    out_trade_no: str
    out_biz_no: Optional[str] = None
    buyer_id: str
    buyer_logon_id: str
    seller_id: str
    seller_email: str
    trade_status: str
    total_amount: str
    receipt_amount: Optional[str] = None
    invoice_amount: Optional[str] = None
    buyer_pay_amount: Optional[str] = None
    point_amount: Optional[str] = None
    refund_fee: Optional[str] = None
    subject: str
    body: Optional[str] = None
    gmt_create: str
    gmt_payment: Optional[str] = None
    gmt_refund: Optional[str] = None
    gmt_close: Optional[str] = None
    fund_bill_list: Optional[str] = None
    passback_params: Optional[str] = None
    voucher_detail_list: Optional[str] = None
