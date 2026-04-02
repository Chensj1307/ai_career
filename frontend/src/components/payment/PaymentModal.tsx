'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createPayment, queryPayment, CreatePaymentResponse } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipLevel: string;
  membershipName: string;
  amount: number;
  onSuccess: () => void;
}

type PaymentMethod = 'wechat' | 'alipay';
type PaymentStatus = 'idle' | 'creating' | 'pending' | 'success' | 'failed' | 'cancelled';

export function PaymentModal({
  isOpen,
  onClose,
  membershipLevel,
  membershipName,
  amount,
  onSuccess
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wechat');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [orderNo, setOrderNo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(600); // 10分钟倒计时

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod('wechat');
      setPaymentStatus('idle');
      setOrderNo('');
      setError('');
      setCountdown(600);
    }
  }, [isOpen]);

  // 倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentStatus === 'pending' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStatus, countdown]);

  // 轮询支付状态
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;
    
    if (paymentStatus === 'pending' && orderNo) {
      pollTimer = setInterval(async () => {
        try {
          const paymentInfo = await queryPayment(orderNo);
          if (paymentInfo) {
            if (paymentInfo.payment_status === 'success') {
              setPaymentStatus('success');
              onSuccess();
            } else if (paymentInfo.payment_status === 'failed') {
              setPaymentStatus('failed');
              setError('支付失败，请重试');
            } else if (paymentInfo.payment_status === 'cancelled') {
              setPaymentStatus('cancelled');
              setError('支付已取消');
            }
          }
        } catch (err) {
          console.error('查询支付状态失败:', err);
        }
      }, 3000); // 每3秒查询一次
    }

    return () => clearInterval(pollTimer);
  }, [paymentStatus, orderNo, onSuccess]);

  const handleCreatePayment = async () => {
    setPaymentStatus('creating');
    setError('');

    try {
      const returnUrl = `${window.location.origin}/membership`;
      const response = await createPayment({
        membership_level: membershipLevel as 'free' | 'basic' | 'premium',
        payment_method: selectedMethod,
        return_url: returnUrl
      });

      if (response.success && response.data) {
        setOrderNo(response.data.order_no);
        setPaymentStatus('pending');
        
        // 调用支付SDK
        await invokePaymentSDK(selectedMethod, response.data);
      } else {
        setPaymentStatus('failed');
        setError(response.message || '创建支付订单失败');
      }
    } catch (err) {
      setPaymentStatus('failed');
      setError('创建支付订单失败，请重试');
    }
  };

  const invokePaymentSDK = async (method: PaymentMethod, paymentData: CreatePaymentResponse['data']) => {
    if (!paymentData) return;

    try {
      if (method === 'wechat') {
        // 调用微信支付SDK
        await invokeWechatPay(paymentData.payment_params);
      } else if (method === 'alipay') {
        // 调用支付宝SDK
        await invokeAlipay(paymentData.payment_params);
      }
    } catch (err) {
      console.error('调用支付SDK失败:', err);
      setError('调用支付失败，请重试');
    }
  };

  const invokeWechatPay = async (params: Record<string, string>) => {
    // 检查是否在微信环境中
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    
    if (isWechat && (window as any).WeixinJSBridge) {
      // 微信内置浏览器，使用JSAPI支付
      (window as any).WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: params.appId,
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.paySign
        },
        (res: any) => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            setPaymentStatus('success');
            onSuccess();
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            setPaymentStatus('cancelled');
            setError('支付已取消');
          } else {
            setPaymentStatus('failed');
            setError('支付失败: ' + res.err_msg);
          }
        }
      );
    } else {
      // 非微信环境，显示二维码或提示
      setError('请在微信中打开进行支付，或使用支付宝');
    }
  };

  const invokeAlipay = async (params: Record<string, string>) => {
    // 支付宝支付
    if (params.orderStr) {
      // 使用支付宝JSAPI
      if ((window as any).AlipayJSBridge) {
        (window as any).AlipayJSBridge.call('tradePay', {
          orderStr: params.orderStr
        }, (result: any) => {
          if (result.resultCode === '9000') {
            setPaymentStatus('success');
            onSuccess();
          } else if (result.resultCode === '6001') {
            setPaymentStatus('cancelled');
            setError('支付已取消');
          } else {
            setPaymentStatus('failed');
            setError('支付失败: ' + result.memo);
          }
        });
      } else {
        // 非支付宝环境，跳转支付
        window.location.href = `https://openapi.alipay.com/gateway.do?${params.orderStr}`;
      }
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (paymentStatus === 'pending') {
      // 如果正在支付中，提示用户
      if (confirm('支付正在进行中，确定要取消吗？')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {paymentStatus === 'success' ? '支付成功' :
             paymentStatus === 'failed' ? '支付失败' :
             paymentStatus === 'cancelled' ? '支付已取消' :
             '选择支付方式'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 订单信息 */}
          {paymentStatus !== 'success' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-500">购买{membershipName}</p>
              <p className="text-3xl font-bold text-slate-800">¥{amount}</p>
            </div>
          )}

          {/* 支付方式选择 */}
          {paymentStatus === 'idle' && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">选择支付方式</p>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedMethod === 'wechat'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedMethod('wechat')}
                >
                  <CardContent className="p-4 flex flex-col items-center space-y-2">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      微
                    </div>
                    <span className="text-sm font-medium">微信支付</span>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${
                    selectedMethod === 'alipay'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedMethod('alipay')}
                >
                  <CardContent className="p-4 flex flex-col items-center space-y-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      支
                    </div>
                    <span className="text-sm font-medium">支付宝</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 支付中状态 */}
          {paymentStatus === 'creating' && (
            <div className="text-center space-y-4 py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500" />
              <p className="text-slate-600">正在创建支付订单...</p>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center space-y-4 py-8">
              <Clock className="w-12 h-12 mx-auto text-orange-500 animate-pulse" />
              <div className="space-y-2">
                <p className="text-slate-600">请在{selectedMethod === 'wechat' ? '微信' : '支付宝'}中完成支付</p>
                <p className="text-sm text-slate-500">
                  剩余时间: <span className="font-mono text-orange-600">{formatCountdown(countdown)}</span>
                </p>
              </div>
              <p className="text-xs text-slate-400">订单号: {orderNo}</p>
            </div>
          )}

          {/* 支付成功 */}
          {paymentStatus === 'success' && (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-800">支付成功！</p>
                <p className="text-sm text-slate-600">您已成功购买{membershipName}</p>
              </div>
              <Button onClick={onClose} className="w-full">
                确定
              </Button>
            </div>
          )}

          {/* 支付失败 */}
          {(paymentStatus === 'failed' || paymentStatus === 'cancelled') && (
            <div className="text-center space-y-4 py-8">
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-800">
                  {paymentStatus === 'cancelled' ? '支付已取消' : '支付失败'}
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  关闭
                </Button>
                <Button onClick={() => setPaymentStatus('idle')} className="flex-1">
                  重新支付
                </Button>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          {paymentStatus === 'idle' && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                取消
              </Button>
              <Button onClick={handleCreatePayment} className="flex-1">
                确认支付 ¥{amount}
              </Button>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <Button variant="outline" onClick={handleClose} className="w-full">
              稍后支付
            </Button>
          )}
        </div>

        {/* 安全提示 */}
        {paymentStatus !== 'success' && paymentStatus !== 'failed' && paymentStatus !== 'cancelled' && (
          <p className="text-xs text-center text-slate-400 mt-4">
            安全支付保障 · 支持微信、支付宝
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
