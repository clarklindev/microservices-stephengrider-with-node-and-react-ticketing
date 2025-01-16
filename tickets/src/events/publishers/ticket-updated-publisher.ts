import { Publisher, Subjects, TicketUpdatedEvent } from '@clarklindev/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
}