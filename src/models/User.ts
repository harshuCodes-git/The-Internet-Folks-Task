import mongoose, { Document, Schema } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: Date;
}

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
        default: () => Snowflake.generate(),
        unique: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 64
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 128
    },
    password: {
        type: String,
        required: true,
        maxlength: 64
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IUser>('User', userSchema); 