import { Publisher, Subjects, ExpirationCompleteEvent } from "@clarklindev/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComplete;
}