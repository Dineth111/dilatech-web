import mongoose from 'mongoose';

const ScreenshotSchema = new mongoose.Schema(
  {
    src: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const AppSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: '' },
    shortDesc: { type: String, default: '' },
    fullDesc: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    downloads: { type: String, default: '0' },
    iconClass: { type: String, default: '' },
    iconBxi: { type: String, default: '' },
    screenshots: { type: [ScreenshotSchema], default: [] },
    playStoreUrl: { type: String, default: '' },
    appStoreUrl: { type: String, default: '' },
    features: { type: [String], default: [] },
    version: { type: String, default: '' },
    size: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.App || mongoose.model('App', AppSchema);
