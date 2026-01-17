import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
    counterName: string;
    count: number;
}

const VisitorSchema: Schema = new Schema({
    counterName: { type: String, default: "total_visitors" },
    count: { type: Number, default: 11647 }
});

export default mongoose.model<IVisitor>('Visitor', VisitorSchema);