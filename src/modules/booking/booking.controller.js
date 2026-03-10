import * as bookingService from './booking.service.js';

export async function create(req, res) {
  try {
    const { studentId, lessonId } = req.body;
    const booking = await bookingService.createBooking(req.userId, { studentId, lessonId });
    res.status(201).json(booking);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}
