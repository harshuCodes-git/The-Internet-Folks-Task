import mongoose, { Document, Schema } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';

export interface ICommunity extends Document {
    id: string;
    name: string;
    slug: string;
    owner: string;
    created_at: Date;
    updated_at: Date;
}

const communitySchema = new Schema<ICommunity>({
    id: {
        type: String,
        required: true,
        default: () => Snowflake.generate(),
        unique: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 128
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
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
communitySchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

export default mongoose.model<ICommunity>('Community', communitySchema); 