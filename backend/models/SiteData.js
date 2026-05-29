import mongoose from 'mongoose';

const SiteDataSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.SiteData || mongoose.model('SiteData', SiteDataSchema);
