import Notification from '@/models/notification';
import mongoose from 'mongoose';


mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function POST(req) {
  try {
    const { investorId, entrepreneurId, pitchId } = await req.json();

    const notification = new Notification({
      entrepreneurId,
      investorId,
      pitchId,
      message: 'An investor wants to view your pitch',
      status: 'pending',
    });

    await notification.save();

    return new Response(JSON.stringify({ message: 'Notification sent' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
