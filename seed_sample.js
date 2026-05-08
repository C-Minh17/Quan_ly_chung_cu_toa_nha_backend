const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const uri = `mongodb${dbPort ? '' : '+srv'}://${dbUser}:${encodeURIComponent(dbPass)}@${dbHost}${dbPort ? ':' + dbPort : ''}`;

const collectionMapping = {
    buildings: 'buildings',
    floors: 'floors',
    apartments: 'apartments',
    users: 'users',
    residents: 'residents',
    feeTypes: 'feeTypes',
    utilityReadings: 'utilityReading',
    invoices: 'invoices',
    invoiceDetails: 'invoice_details',
    contracts: 'contracts',
    vehicles: 'vehicles',
    files: 'files',
    maintenanceRequests: 'maintenance_requests',
    maintenanceSchedules: 'maintenance_schedules',
    maintenanceImages: 'maintenance_images',
    permissionGroups: 'permission_groups',
    permissionTypes: 'permission_types',
    permissions: 'permissions',
    roles: 'roles',
    admins: 'admins',
    userRoles: 'user_roles',
    userPermissionGroups: 'user_permission_groups',
    userPermissions: 'user-permissions'
};

function convertToObjectId(obj) {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string' && /^[0-9a-fA-F]{24}$/.test(obj)) {
            return new ObjectId(obj);
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(convertToObjectId);
    }
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        newObj[key] = convertToObjectId(value);
    }
    return newObj;
}

async function seed() {
    console.log('Connecting to URI:', uri.replace(dbPass, '****')); // Hide password
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample_data.json'), 'utf8'));

        for (const [key, documents] of Object.entries(data)) {
            const collectionName = collectionMapping[key] || key;
            if (documents.length === 0) continue;

            const convertedDocs = documents.map(convertToObjectId);
            
            try {
                await db.collection(collectionName).drop();
                console.log(`Dropped collection: ${collectionName}`);
            } catch (e) {
                // Ignore if collection doesn't exist
            }

            await db.collection(collectionName).insertMany(convertedDocs);
            console.log(`Inserted ${documents.length} docs into ${collectionName}`);
        }
        console.log('Seeding completed successfully!');
    } catch (e) {
        console.error('Error seeding data:', e);
    } finally {
        await client.close();
    }
}

seed();
