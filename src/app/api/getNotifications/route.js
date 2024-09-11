import Notification from '@/models/notification';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const entrepreneurId = searchParams.get('entrepreneurId');

  if (!entrepreneurId) {
    return new Response(JSON.stringify({ message: 'entrepreneurId is required' }), {
      status: 400,
    });
  }

  try {
    const notifications = await Notification.find({ entrepreneurId })
      .populate('investorId', 'name') 
      .populate('pitchId', 'companyName');

    return new Response(JSON.stringify(notifications), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
