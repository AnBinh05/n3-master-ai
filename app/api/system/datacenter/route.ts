import { NextResponse } from 'next/server';
import {
  getDatacenterStatus,
  setSimulateFailure,
  setActiveDatacenter,
  isSimulatingFailure,
  DatacenterId,
} from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getDatacenterStatus();
    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi kiểm tra trạng thái Datacenter' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'toggle_simulation') {
      const current = isSimulatingFailure();
      setSimulateFailure(!current);
    } else if (body.action === 'set_simulation') {
      setSimulateFailure(Boolean(body.value));
    } else if (body.action === 'switch_datacenter' && body.datacenter) {
      setActiveDatacenter(body.datacenter as DatacenterId);
    }

    const updatedStatus = await getDatacenterStatus();
    return NextResponse.json({
      success: true,
      message: 'Cập nhật trạng thái Datacenter thành công',
      status: updatedStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi thao tác Datacenter' },
      { status: 400 }
    );
  }
}
