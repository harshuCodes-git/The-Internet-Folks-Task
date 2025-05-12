import mongoose, { Document, Schema } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';

export interface IMember extends Document {
    id: string;
    community: string;
    user: string;
    role: string;
    created_at: Date;
}

const memberSchema = new Schema<IMember>({
    id: {
        type: String,
        required: true,
        default: () => Snowflake.generate(),
        unique: true
    },
    community: {
        type: String,
        required: true,
        ref: 'Community'
    },
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    role: {
        type: String,
        required: true,
        ref: 'Role'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index to ensure a user can only have one role in a community
memberSchema.index({ community: 1, user: 1 }, { unique: true });

export default mongoose.model<IMember>('Member', memberSchema); 