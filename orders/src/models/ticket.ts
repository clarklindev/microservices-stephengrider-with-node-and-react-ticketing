import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order, OrderStatus} from './order';

interface TicketAttrs{
  id: string;
  title: string;
  price: number;
  
}

export interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  version:number;
  isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event:{id:string, version:number}):Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true
  },
  price:{
    type:Number,
    required:true,
    min: 0
  }
}, 

{
  toJSON:{
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
    }
  }
}
);

ticketSchema.set('versionKey', `version`);

ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre('save', function(done){
//   //@ts-ignore
//   this.$where = {
//     version: this.get('version') - 1
//   }

//   done();
// })

ticketSchema.statics.findByEvent = (event: {id:string, version:number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

ticketSchema.statics.build = (attrs:TicketAttrs) => {
  const { id, ...rest } = attrs; // Extract 'id' and keep the rest of the properties
  return new Ticket({
    _id: id,  // Assign 'id' to '_id'
    ...rest,  // Spread the rest of the properties
  });
}

//lesson 365.
ticketSchema.methods.isReserved = async function(){
  //this === the ticket document that we just called `isReserved` on
  //make sure ticket is not already reserved (expiresAt - caters for high-traffic)

  //run query to look at all orders. find an order where the ticket is the ticket we just found *and* the orders status is *not* cancelled.
  //if we find an order - that mean the ticket *is* reserved

  //!!existingOrder (returns !! means as boolean)

  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
}

//the collection is called `Ticket`
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket}