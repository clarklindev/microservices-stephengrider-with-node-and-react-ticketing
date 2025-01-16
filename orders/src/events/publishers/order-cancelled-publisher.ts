import {Subjects, Publisher, OrderCancelledEvent} from '@clarklindev/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  readonly subject = Subjects.OrderCancelled
}