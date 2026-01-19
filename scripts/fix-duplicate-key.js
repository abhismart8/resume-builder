process.env.MONGODB_URI = "mongodb+srv://mongo_db_user:iwtjG1sfpNL0KXGZ@resume-builder.ejvthzt.mongodb.net/?appName=resume-builder";


// import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import Resume from '../src/models/Resume.js';

async function fixDuplicateKeyError() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Dropping existing shareableLink index...');
    try {
      await Resume.collection.dropIndex('shareableLink_1');
      console.log('✓ Index dropped successfully');
    } catch (error) {
      if (error.message.includes('index not found')) {
        console.log('✓ Index did not exist (no action needed)');
      } else {
        throw error;
      }
    }

    console.log('Removing null shareableLink values from existing documents...');
    const result = await Resume.updateMany(
      { shareableLink: null },
      { $unset: { shareableLink: '' } },
      { multi: true }
    );
    console.log(`✓ Updated ${result.modifiedCount} documents`);

    console.log('Recreating sparse unique index...');
    await Resume.collection.createIndex(
      { shareableLink: 1 },
      { unique: true, sparse: true }
    );
    console.log('✓ Index recreated successfully');

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

fixDuplicateKeyError();
