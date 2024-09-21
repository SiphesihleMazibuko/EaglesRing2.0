import Notification from '@/models/notification';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || '');

export async function POST(req) {
  const { notificationId, status } = await req.json();

  if (!notificationId || !status) {
    return new Response(JSON.stringify({ message: 'Invalid data' }), {
      status: 400,
    });
  }

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return new Response(JSON.stringify({ message: 'Notification not found' }), {
        status: 404,
      });
    }

    notification.status = status;
    await notification.save();

    return new Response(JSON.stringify({ message: 'Notification updated' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
