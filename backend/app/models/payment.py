"""
支付相关数据模型
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum


class PaymentStatus(str, enum.Enum):
    """支付状态枚举"""
    PENDING = "pending"           # 待支付
    PROCESSING = "processing"     # 处理中
    SUCCESS = "success"           # 支付成功
    FAILED = "failed"             # 支付失败
    CANCELLED = "cancelled"       # 已取消
    REFUNDED = "refunded"         # 已退款


class PaymentMethod(str, enum.Enum):
    """支付方式枚举"""
    WECHAT = "wechat"             # 微信支付
    ALIPAY = "alipay"             # 支付宝


class MembershipLevel(str, enum.Enum):
    """会员等级枚举"""
    FREE = "free"                 # 免费会员
    BASIC = "basic"               # 基础会员
    PREMIUM = "premium"           # 高级会员


class PaymentOrder(Base):
    """支付订单表"""
    __tablename__ = "payment_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(64), unique=True, index=True, nullable=False, comment="订单号")
    user_id = Column(String(100), nullable=False, index=True, comment="用户ID")
    
    # 订单信息
    amount = Column(Float, nullable=False, comment="订单金额")
    currency = Column(String(10), default="CNY", comment="货币类型")
    description = Column(String(255), comment="订单描述")
    
    # 支付信息
    payment_method = Column(String(20), comment="支付方式: wechat/alipay")
    payment_status = Column(String(20), default="pending", comment="支付状态")
    
    # 第三方支付信息
    third_party_order_id = Column(String(128), comment="第三方订单号")
    third_party_response = Column(JSON, comment="第三方响应数据")
    
    # 会员信息
    membership_level = Column(String(20), nullable=False, comment="购买的会员等级")
    membership_duration_days = Column(Integer, default=365, comment="会员时长(天)")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    paid_at = Column(DateTime(timezone=True), comment="支付完成时间")
    expired_at = Column(DateTime(timezone=True), comment="订单过期时间")
    
    # 回调信息
    notify_url = Column(String(255), comment="异步通知URL")
    return_url = Column(String(255), comment="同步返回URL")
    
    # 备注
    remark = Column(Text, comment="备注")


class UserMembership(Base):
    """用户会员信息表"""
    __tablename__ = "user_memberships"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), unique=True, nullable=False, index=True, comment="用户ID")
    
    # 会员信息
    level = Column(String(20), default="free", comment="会员等级: free/basic/premium")
    start_date = Column(DateTime(timezone=True), comment="开始时间")
    end_date = Column(DateTime(timezone=True), comment="结束时间")
    status = Column(String(20), default="active", comment="状态: active/expired/cancelled")
    
    # 支付信息
    last_order_id = Column(Integer, ForeignKey("payment_orders.id"), comment="最后支付订单ID")
    total_paid_amount = Column(Float, default=0, comment="累计支付金额")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联
    last_order = relationship("PaymentOrder")


class PaymentConfig(Base):
    """支付配置表"""
    __tablename__ = "payment_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 配置名称
    config_name = Column(String(50), unique=True, nullable=False, comment="配置名称")
    config_type = Column(String(20), nullable=False, comment="配置类型: wechat/alipay")
    
    # 配置值（加密存储）
    app_id = Column(String(100), comment="应用ID")
    mch_id = Column(String(100), comment="商户号")
    api_key = Column(Text, comment="API密钥(加密)")
    app_secret = Column(Text, comment="应用密钥(加密)")
    
    # 证书配置
    cert_path = Column(String(255), comment="证书路径")
    key_path = Column(String(255), comment="密钥路径")
    
    # 环境配置
    sandbox = Column(Integer, default=1, comment="是否沙箱环境: 0-生产 1-沙箱")
    notify_url = Column(String(255), comment="异步通知URL")
    return_url = Column(String(255), comment="同步返回URL")
    
    # 状态
    is_active = Column(Integer, default=1, comment="是否启用: 0-禁用 1-启用")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 备注
    remark = Column(Text, comment="备注")


class MembershipPrice(Base):
    """会员价格配置表"""
    __tablename__ = "membership_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 会员等级
    level = Column(String(20), unique=True, nullable=False, comment="会员等级")
    
    # 价格信息
    price = Column(Float, nullable=False, comment="价格")
    original_price = Column(Float, comment="原价")
    currency = Column(String(10), default="CNY", comment="货币类型")
    
    # 时长
    duration_days = Column(Integer, default=365, comment="会员时长(天)")
    
    # 权益描述
    benefits = Column(JSON, comment="权益列表(JSON)")
    description = Column(Text, comment="描述")
    
    # 状态
    is_active = Column(Integer, default=1, comment="是否启用: 0-禁用 1-启用")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
