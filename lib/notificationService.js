import { prisma } from './prisma';

export class NotificationService {
  // Create a new notification
  static async createNotification(userId, title, message, type, data = null) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          status: 'unread',
          data: data ? JSON.parse(JSON.stringify(data)) : null
        }
      });
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notification for new order (for supplier)
  static async notifyNewOrder(orderId, supplierId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: true,
          vendor: {
            include: {
              user: true
            }
          }
        }
      });

      if (!order) return;

      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
        include: { user: true }
      });

      if (!supplier) return;

      await this.createNotification(
        supplier.userId,
        'New Order Received',
        `You have received a new order for ${order.quantity} ${order.product.unit} of ${order.product.name} from ${order.vendor.user.name}`,
        'order',
        {
          orderId: order.id,
          productId: order.product.id,
          vendorId: order.vendor.id,
          quantity: order.quantity,
          totalPrice: order.totalPrice
        }
      );
    } catch (error) {
      console.error('Error creating new order notification:', error);
    }
  }

  // Create notification for order status update (for vendor)
  static async notifyOrderStatusUpdate(orderId, newStatus) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: {
            include: {
              supplier: {
                include: {
                  user: true
                }
              }
            }
          },
          vendor: {
            include: {
              user: true
            }
          }
        }
      });

      if (!order) return;

      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being prepared',
        'shipped': 'Your order has been shipped and is in transit',
        'delivered': 'Your order has been successfully delivered',
        'cancelled': 'Your order has been cancelled'
      };

      const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}`;

      await this.createNotification(
        order.vendor.userId,
        'Order Status Updated',
        `${message} - ${order.product.name} (${order.quantity} ${order.product.unit})`,
        'order',
        {
          orderId: order.id,
          productId: order.product.id,
          supplierId: order.product.supplier.id,
          status: newStatus
        }
      );
    } catch (error) {
      console.error('Error creating order status notification:', error);
    }
  }

  // Create notification for low stock (for supplier)
  static async notifyLowStock(productId, currentStock, threshold = 10) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          supplier: {
            include: {
              user: true
            }
          }
        }
      });

      if (!product || currentStock > threshold) return;

      await this.createNotification(
        product.supplier.userId,
        'Low Stock Alert',
        `Your product "${product.name}" is running low on stock. Current stock: ${currentStock} ${product.unit}`,
        'product',
        {
          productId: product.id,
          currentStock,
          threshold
        }
      );
    } catch (error) {
      console.error('Error creating low stock notification:', error);
    }
  }

  // Create notification for payment received (for supplier)
  static async notifyPaymentReceived(orderId, amount) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: {
            include: {
              supplier: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });

      if (!order) return;

      await this.createNotification(
        order.product.supplier.userId,
        'Payment Received',
        `Payment of ₹${amount} received for order #${order.id.slice(-8).toUpperCase()}`,
        'payment',
        {
          orderId: order.id,
          amount,
          productId: order.product.id
        }
      );
    } catch (error) {
      console.error('Error creating payment notification:', error);
    }
  }

  // Create system notification
  static async notifySystem(userId, title, message, data = null) {
    try {
      await this.createNotification(userId, title, message, 'system', data);
    } catch (error) {
      console.error('Error creating system notification:', error);
    }
  }

  // Create delivery notification
  static async notifyDelivery(orderId, deliveryDate) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: {
            include: {
              supplier: {
                include: {
                  user: true
                }
              }
            }
          },
          vendor: {
            include: {
              user: true
            }
          }
        }
      });

      if (!order) return;

      // Notify vendor about delivery
      await this.createNotification(
        order.vendor.userId,
        'Delivery Scheduled',
        `Your order of ${order.product.name} is scheduled for delivery on ${new Date(deliveryDate).toLocaleDateString()}`,
        'delivery',
        {
          orderId: order.id,
          deliveryDate,
          productId: order.product.id
        }
      );

      // Notify supplier about delivery
      await this.createNotification(
        order.product.supplier.userId,
        'Delivery Scheduled',
        `Order #${order.id.slice(-8).toUpperCase()} is scheduled for delivery on ${new Date(deliveryDate).toLocaleDateString()}`,
        'delivery',
        {
          orderId: order.id,
          deliveryDate,
          vendorId: order.vendor.id
        }
      );
    } catch (error) {
      console.error('Error creating delivery notification:', error);
    }
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          status: 'unread'
        }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Mark notifications as read
  static async markAsRead(userId, notificationIds) {
    try {
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId
        },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          status: 'unread'
        },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
} 