import mongoose, { Document, Schema } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';

export interface IRole extends Document {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

const roleSchema = new Schema<IRole>({
    id: {
        type: String,
        required: true,
        default: () => Snowflake.generate(),
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 64
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update the updated_at timestamp before saving
roleSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

export default mongoose.model<IRole>('Role', roleSchema); 