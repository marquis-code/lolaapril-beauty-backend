"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_schema_1 = require("./schemas/client.schema");
const csv = require("csv-writer");
const PDFDocument = require("pdfkit");
const fs_1 = require("fs");
const csv_parser_1 = require("csv-parser");
let ClientService = class ClientService {
    constructor(clientModel) {
        this.clientModel = clientModel;
    }
    async create(createClientDto, businessId) {
        try {
            const existingClient = await this.clientModel.findOne({
                "profile.email": createClientDto.profile.email,
                businessId,
            });
            if (existingClient) {
                throw new common_1.ConflictException("Client with this email already exists");
            }
            const client = new this.clientModel({
                ...createClientDto,
                businessId,
            });
            const savedClient = await client.save();
            return {
                success: true,
                data: savedClient,
                message: "Client created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create client: ${error.message}`);
        }
    }
    async findAll(query, businessId) {
        try {
            const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search, clientSource, gender, isActive, country, } = query;
            const filter = { businessId };
            if (search) {
                filter.$or = [
                    { "profile.firstName": { $regex: search, $options: "i" } },
                    { "profile.lastName": { $regex: search, $options: "i" } },
                    { "profile.email": { $regex: search, $options: "i" } },
                    { "profile.phone.number": { $regex: search, $options: "i" } },
                ];
            }
            if (clientSource)
                filter["additionalInfo.clientSource"] = clientSource;
            if (gender)
                filter["profile.gender"] = gender;
            if (isActive !== undefined)
                filter.isActive = isActive;
            if (country)
                filter["additionalInfo.country"] = country;
            const skip = (page - 1) * limit;
            const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
            const clients = await this.clientModel
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();
            const total = await this.clientModel.countDocuments(filter).exec();
            return {
                success: true,
                data: clients,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch clients: ${error.message}`);
        }
    }
    async findOne(id, businessId) {
        try {
            const client = await this.clientModel.findOne({ _id: id, businessId });
            if (!client) {
                throw new common_1.NotFoundException("Client not found");
            }
            return {
                success: true,
                data: client,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch client: ${error.message}`);
        }
    }
    async update(id, updateClientDto, businessId) {
        try {
            if (updateClientDto.profile?.email) {
                const existingClient = await this.clientModel.findOne({
                    "profile.email": updateClientDto.profile.email,
                    businessId,
                    _id: { $ne: id },
                });
                if (existingClient) {
                    throw new common_1.ConflictException("Client with this email already exists");
                }
            }
            const client = await this.clientModel.findOneAndUpdate({ _id: id, businessId }, { ...updateClientDto, updatedAt: new Date() }, { new: true, runValidators: true });
            if (!client) {
                throw new common_1.NotFoundException("Client not found");
            }
            return {
                success: true,
                data: client,
                message: "Client updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update client: ${error.message}`);
        }
    }
    async remove(id, businessId) {
        try {
            const client = await this.clientModel.findOneAndUpdate({ _id: id, businessId }, { isActive: false, updatedAt: new Date() }, { new: true });
            if (!client) {
                throw new common_1.NotFoundException("Client not found");
            }
            return {
                success: true,
                message: "Client deactivated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to deactivate client: ${error.message}`);
        }
    }
    async exportToCSV(businessId) {
        try {
            const clients = await this.clientModel.find({ businessId, isActive: true });
            const csvWriter = csv.createObjectCsvWriter({
                path: "clients-export.csv",
                header: [
                    { id: "firstName", title: "First Name" },
                    { id: "lastName", title: "Last Name" },
                    { id: "email", title: "Email" },
                    { id: "phone", title: "Phone" },
                    { id: "gender", title: "Gender" },
                    { id: "clientSource", title: "Source" },
                    { id: "totalVisits", title: "Total Visits" },
                    { id: "totalSpent", title: "Total Spent" },
                    { id: "createdAt", title: "Created At" },
                ],
            });
            const records = clients.map((client) => ({
                firstName: client.profile.firstName,
                lastName: client.profile.lastName,
                email: client.profile.email,
                phone: client.profile.phone.number,
                gender: client.profile.gender || "",
                clientSource: client.additionalInfo?.clientSource || "",
                totalVisits: client.totalVisits,
                totalSpent: client.totalSpent,
                createdAt: client.createdAt.toISOString(),
            }));
            await csvWriter.writeRecords(records);
            return "clients-export.csv";
        }
        catch (error) {
            throw new Error(`Failed to export clients to CSV: ${error.message}`);
        }
    }
    async exportToPDF(businessId) {
        try {
            const clients = await this.clientModel.find({ businessId, isActive: true });
            const doc = new PDFDocument();
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            return new Promise((resolve, reject) => {
                doc.on("end", () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });
                doc.on("error", reject);
                doc.fontSize(20).text("Client List", 100, 100);
                doc.moveDown();
                clients.forEach((client, index) => {
                    const y = 150 + index * 60;
                    doc
                        .fontSize(12)
                        .text(`${client.profile.firstName} ${client.profile.lastName}`, 100, y)
                        .text(`Email: ${client.profile.email}`, 100, y + 15)
                        .text(`Phone: ${client.profile.phone.number}`, 100, y + 30)
                        .text(`Visits: ${client.totalVisits} | Spent: ${client.totalSpent}`, 100, y + 45);
                });
                doc.end();
            });
        }
        catch (error) {
            throw new Error(`Failed to export clients to PDF: ${error.message}`);
        }
    }
    async importFromCSV(filePath, businessId) {
        try {
            const results = [];
            const errors = [];
            let imported = 0;
            return new Promise((resolve, reject) => {
                (0, fs_1.createReadStream)(filePath)
                    .pipe((0, csv_parser_1.default)())
                    .on("data", (data) => results.push(data))
                    .on("end", async () => {
                    for (const row of results) {
                        try {
                            const clientData = {
                                profile: {
                                    firstName: row["First Name"],
                                    lastName: row["Last Name"],
                                    email: row["Email"],
                                    phone: {
                                        countryCode: "+234",
                                        number: row["Phone"],
                                    },
                                    gender: row["Gender"],
                                },
                                additionalInfo: {
                                    clientSource: row["Source"] || "Import",
                                },
                            };
                            await this.create(clientData, businessId);
                            imported++;
                        }
                        catch (error) {
                            errors.push(`Row ${results.indexOf(row) + 1}: ${error.message}`);
                        }
                    }
                    resolve({
                        success: true,
                        data: { imported, errors },
                        message: `Import completed. ${imported} clients imported successfully.`,
                    });
                })
                    .on("error", reject);
            });
        }
        catch (error) {
            throw new Error(`Failed to import clients from CSV: ${error.message}`);
        }
    }
    async getClientStats(businessId) {
        try {
            const totalClients = await this.clientModel.countDocuments({ businessId }).exec();
            const activeClients = await this.clientModel.countDocuments({ businessId, isActive: true }).exec();
            const newThisMonth = await this.clientModel.countDocuments({
                businessId,
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            }).exec();
            const topSources = await this.clientModel.aggregate([
                { $match: { businessId, isActive: true } },
                { $group: { _id: "$additionalInfo.clientSource", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ]);
            return {
                success: true,
                data: {
                    totalClients,
                    activeClients,
                    newThisMonth,
                    topSources,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get client stats: ${error.message}`);
        }
    }
    async enableGrokCodeFast1ForAllClients(businessId) {
        try {
            const filter = {};
            if (businessId) {
                filter.businessId = businessId;
            }
            const result = await this.clientModel.updateMany(filter, {
                $set: {
                    "settings.grokCodeFast1Enabled": true,
                    updatedAt: new Date(),
                },
            });
            return {
                success: true,
                data: {
                    matched: result.matchedCount,
                    modified: result.modifiedCount,
                },
                message: `Grok Code Fast 1 enabled for ${result.modifiedCount} client(s)`,
            };
        }
        catch (error) {
            throw new Error(`Failed to enable Grok Code Fast 1: ${error.message}`);
        }
    }
};
ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map