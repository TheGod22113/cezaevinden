import { NextRequest, NextResponse } from 'next/server';
import iyzipay from 'iyzipay';

const Iyzico = iyzipay.default;

function checkoutFormInitializePromise(
  iyzicol: any,
  request: any
): Promise<{ checkoutFormContent: string }> {
  return new Promise((resolve, reject) => {
    iyzicol.checkoutFormInitialize(request, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, orderNumber, totalAmount, customerEmail, customerName } = await req.json();

    if (!orderId || !totalAmount || !customerEmail) {
      return NextResponse.json(
        { error: 'Gerekli bilgiler eksik' },
        { status: 400 }
      );
    }

    const iyzicol = new Iyzico({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: 'https://api.iyzipay.com',
    });

    const [firstName, ...lastNameParts] = customerName.split(' ');

    const request = {
      locale: 'tr',
      conversationId: orderId,
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: 'TRY',
      installment: '1',
      basketId: orderId,
      paymentChannel: 'WEB',
      pageType: 'PRODUCT',
      clientIp: req.headers.get('x-forwarded-for') || '127.0.0.1',

      // Buyer
      buyer: {
        id: orderNumber,
        name: firstName || 'Alıcı',
        surname: lastNameParts.join(' ') || firstName || 'Alıcı',
        gsmNumber: '5000000000',
        email: customerEmail,
        identityNumber: '00000000000',
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: 'Ankara',
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        city: 'Ankara',
        country: 'Turkey',
        zipCode: '06100',
      },

      // Billing & Shipping address
      billingAddress: {
        contactName: customerName,
        city: 'Ankara',
        country: 'Turkey',
        address: 'Ankara',
        zipCode: '06100',
      },

      shippingAddress: {
        contactName: customerName,
        city: 'Ankara',
        country: 'Turkey',
        address: 'Ankara',
        zipCode: '06100',
      },

      // Basket items
      basketItems: [
        {
          id: orderId,
          name: `Sipariş #${orderNumber}`,
          category1: 'Sosyal Girişim',
          itemType: 'PHYSICAL',
          price: totalAmount.toString(),
        },
      ],
    };

    // Create payment form
    const result = await checkoutFormInitializePromise(iyzicol, request);

    if (!result?.checkoutFormContent) {
      return NextResponse.json(
        { error: 'Ödeme formu oluşturulamadı' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutFormContent: result.checkoutFormContent,
      orderId,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Ödeme işlemi başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}
