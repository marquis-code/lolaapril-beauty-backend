// import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { Model, SortOrder } from "mongoose"
// import { Client, type ClientDocument } from "./schemas/client.schema"
// import { CreateClientDto } from "./dto/create-client.dto"
// import { UpdateClientDto } from "./dto/update-client.dto"
// import { ClientQueryDto } from "./dto/client-query.dto"
// import { ApiResponse } from "../common/interfaces/common.interface"
// import * as csv from "csv-writer"
// import * as PDFDocument from "pdfkit"
// import { createReadStream } from "fs"
// import csvParser from "csv-parser"

// @Injectable()
// export class ClientService {
//   constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>) {}

//   async create(createClientDto: CreateClientDto): Promise<ApiResponse<Client>> {
//     try {
//       // Check if client with email already exists
//       const existingClient = await this.clientModel.findOne({
//         "profile.email": createClientDto.profile.email,
//       })

//       if (existingClient) {
//         throw new ConflictException("Client with this email already exists")
//       }

//       const client = new this.clientModel(createClientDto)
//       const savedClient = await client.save()

//       return {
//         success: true,
//         data: savedClient,
//         message: "Client created successfully",
//       }
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to create client: ${error.message}`)
//     }
//   }

//   async findAll(query: ClientQueryDto): Promise<ApiResponse<Client[]>> {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         sortBy = "createdAt",
//         sortOrder = "desc",
//         search,
//         clientSource,
//         gender,
//         isActive,
//         country,
//       } = query

//       const filter: any = {}

//       // Build search filter
//       if (search) {
//         filter.$or = [
//           { "profile.firstName": { $regex: search, $options: "i" } },
//           { "profile.lastName": { $regex: search, $options: "i" } },
//           { "profile.email": { $regex: search, $options: "i" } },
//           { "profile.phone.number": { $regex: search, $options: "i" } },
//         ]
//       }

//       // Apply filters
//       if (clientSource) filter["additionalInfo.clientSource"] = clientSource
//       if (gender) filter["profile.gender"] = gender
//       if (isActive !== undefined) filter.isActive = isActive
//       if (country) filter["additionalInfo.country"] = country

//       const skip = (page - 1) * limit
//       const sortOptions: Record<string, SortOrder> = { [sortBy]: sortOrder === "asc" ? 1 : -1 }

//       // Handle queries sequentially to avoid TypeScript complex union type error
//       const clients = await this.clientModel
//         .find(filter)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(limit)
//         .exec()
      
//       const total = await this.clientModel.countDocuments(filter).exec()

//       return {
//         success: true,
//         data: clients,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to fetch clients: ${error.message}`)
//     }
//   }

//   async findOne(id: string): Promise<ApiResponse<Client>> {
//     try {
//       const client = await this.clientModel.findById(id)
//       if (!client) {
//         throw new NotFoundException("Client not found")
//       }

//       return {
//         success: true,
//         data: client,
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to fetch client: ${error.message}`)
//     }
//   }

//   async update(id: string, updateClientDto: UpdateClientDto): Promise<ApiResponse<Client>> {
//     try {
//       // Check if email is being updated and if it conflicts
//       if (updateClientDto.profile?.email) {
//         const existingClient = await this.clientModel.findOne({
//           "profile.email": updateClientDto.profile.email,
//           _id: { $ne: id },
//         })

//         if (existingClient) {
//           throw new ConflictException("Client with this email already exists")
//         }
//       }

//       const client = await this.clientModel.findByIdAndUpdate(
//         id,
//         { ...updateClientDto, updatedAt: new Date() },
//         { new: true, runValidators: true },
//       )

//       if (!client) {
//         throw new NotFoundException("Client not found")
//       }

//       return {
//         success: true,
//         data: client,
//         message: "Client updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to update client: ${error.message}`)
//     }
//   }

//   async remove(id: string): Promise<ApiResponse<null>> {
//     try {
//       const client = await this.clientModel.findByIdAndUpdate(
//         id,
//         { isActive: false, updatedAt: new Date() },
//         { new: true },
//       )

//       if (!client) {
//         throw new NotFoundException("Client not found")
//       }

//       return {
//         success: true,
//         message: "Client deactivated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to deactivate client: ${error.message}`)
//     }
//   }

//   async exportToCSV(): Promise<string> {
//     try {
//       const clients = await this.clientModel.find({ isActive: true }) as any
//       const csvWriter = csv.createObjectCsvWriter({
//         path: "clients-export.csv",
//         header: [
//           { id: "firstName", title: "First Name" },
//           { id: "lastName", title: "Last Name" },
//           { id: "email", title: "Email" },
//           { id: "phone", title: "Phone" },
//           { id: "gender", title: "Gender" },
//           { id: "clientSource", title: "Source" },
//           { id: "totalVisits", title: "Total Visits" },
//           { id: "totalSpent", title: "Total Spent" },
//           { id: "createdAt", title: "Created At" },
//         ],
//       })

//       const records = clients.map((client) => ({
//         firstName: client.profile.firstName,
//         lastName: client.profile.lastName,
//         email: client.profile.email,
//         phone: client.profile.phone.number,
//         gender: client.profile.gender || "",
//         clientSource: client.additionalInfo?.clientSource || "",
//         totalVisits: client.totalVisits,
//         totalSpent: client.totalSpent,
//         createdAt: client.createdAt.toISOString(),
//       }))

//       await csvWriter.writeRecords(records)
//       return "clients-export.csv"
//     } catch (error) {
//       throw new Error(`Failed to export clients to CSV: ${error.message}`)
//     }
//   }

//   async exportToPDF(): Promise<Buffer> {
//     try {
//       const clients = await this.clientModel.find({ isActive: true })
//       const doc = new PDFDocument()
//       const buffers: Buffer[] = []

//       doc.on("data", buffers.push.bind(buffers))

//       return new Promise((resolve, reject) => {
//         doc.on("end", () => {
//           const pdfData = Buffer.concat(buffers)
//           resolve(pdfData)
//         })

//         doc.on("error", reject)

//         // PDF content
//         doc.fontSize(20).text("Client List", 100, 100)
//         doc.moveDown()

//         clients.forEach((client, index) => {
//           const y = 150 + index * 60
//           doc
//             .fontSize(12)
//             .text(`${client.profile.firstName} ${client.profile.lastName}`, 100, y)
//             .text(`Email: ${client.profile.email}`, 100, y + 15)
//             .text(`Phone: ${client.profile.phone.number}`, 100, y + 30)
//             .text(`Visits: ${client.totalVisits} | Spent: ${client.totalSpent}`, 100, y + 45)
//         })

//         doc.end()
//       })
//     } catch (error) {
//       throw new Error(`Failed to export clients to PDF: ${error.message}`)
//     }
//   }

//   async importFromCSV(filePath: string): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
//     try {
//       const results: any[] = []
//       const errors: string[] = []
//       let imported = 0

//       return new Promise((resolve, reject) => {
//         createReadStream(filePath)
//           .pipe(csvParser())
//           .on("data", (data) => results.push(data))
//           .on("end", async () => {
//             for (const row of results) {
//               try {
//                 const clientData: CreateClientDto = {
//                   profile: {
//                     firstName: row["First Name"],
//                     lastName: row["Last Name"],
//                     email: row["Email"],
//                     phone: {
//                       countryCode: "+234", // Default country code
//                       number: row["Phone"],
//                     },
//                     gender: row["Gender"],
//                   },
//                   additionalInfo: {
//                     clientSource: row["Source"] || "Import",
//                   },
//                 }

//                 await this.create(clientData)
//                 imported++
//               } catch (error) {
//                 errors.push(`Row ${results.indexOf(row) + 1}: ${error.message}`)
//               }
//             }

//             resolve({
//               success: true,
//               data: { imported, errors },
//               message: `Import completed. ${imported} clients imported successfully.`,
//             })
//           })
//           .on("error", reject)
//       })
//     } catch (error) {
//       throw new Error(`Failed to import clients from CSV: ${error.message}`)
//     }
//   }

//   async getClientStats(): Promise<ApiResponse<any>> {
//     try {
//       // Handle queries sequentially to avoid TypeScript complex union type error
//       const totalClients = await this.clientModel.countDocuments().exec()
//       const activeClients = await this.clientModel.countDocuments({ isActive: true }).exec()
//       const newThisMonth = await this.clientModel.countDocuments({
//         createdAt: {
//           $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//         },
//       }).exec()

//       const topSources = await this.clientModel.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: "$additionalInfo.clientSource", count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 5 },
//       ])

//       return {
//         success: true,
//         data: {
//           totalClients,
//           activeClients,
//           newThisMonth,
//           topSources,
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to get client stats: ${error.message}`)
//     }
//   }
// }

// src/modules/client/client.service.ts
import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, SortOrder } from "mongoose"
import { Client, type ClientDocument } from "./schemas/client.schema"
import { CreateClientDto } from "./dto/create-client.dto"
import { UpdateClientDto } from "./dto/update-client.dto"
import { ClientQueryDto } from "./dto/client-query.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import * as csv from "csv-writer"
import * as PDFDocument from "pdfkit"
import { createReadStream } from "fs"
import csvParser from "csv-parser"

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>) {}

  async create(createClientDto: CreateClientDto, businessId: string): Promise<ApiResponse<Client>> {
    try {
      const existingClient = await this.clientModel.findOne({
        "profile.email": createClientDto.profile.email,
        businessId,
      })

      if (existingClient) {
        throw new ConflictException("Client with this email already exists")
      }

      const client = new this.clientModel({
        ...createClientDto,
        businessId,
      })
      const savedClient = await client.save()

      return {
        success: true,
        data: savedClient,
        message: "Client created successfully",
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to create client: ${error.message}`)
    }
  }

  async findAll(query: ClientQueryDto, businessId: string): Promise<ApiResponse<Client[]>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        clientSource,
        gender,
        isActive,
        country,
      } = query

      const filter: any = { businessId }

      if (search) {
        filter.$or = [
          { "profile.firstName": { $regex: search, $options: "i" } },
          { "profile.lastName": { $regex: search, $options: "i" } },
          { "profile.email": { $regex: search, $options: "i" } },
          { "profile.phone.number": { $regex: search, $options: "i" } },
        ]
      }

      if (clientSource) filter["additionalInfo.clientSource"] = clientSource
      if (gender) filter["profile.gender"] = gender
      if (isActive !== undefined) filter.isActive = isActive
      if (country) filter["additionalInfo.country"] = country

      const skip = (page - 1) * limit
      const sortOptions: Record<string, SortOrder> = { [sortBy]: sortOrder === "asc" ? 1 : -1 }

      const clients = await this.clientModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec()
      
      const total = await this.clientModel.countDocuments(filter).exec()

      return {
        success: true,
        data: clients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`)
    }
  }

  async findOne(id: string, businessId: string): Promise<ApiResponse<Client>> {
    try {
      const client = await this.clientModel.findOne({ _id: id, businessId })
      if (!client) {
        throw new NotFoundException("Client not found")
      }

      return {
        success: true,
        data: client,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to fetch client: ${error.message}`)
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto, businessId: string): Promise<ApiResponse<Client>> {
    try {
      if (updateClientDto.profile?.email) {
        const existingClient = await this.clientModel.findOne({
          "profile.email": updateClientDto.profile.email,
          businessId,
          _id: { $ne: id },
        })

        if (existingClient) {
          throw new ConflictException("Client with this email already exists")
        }
      }

      const client = await this.clientModel.findOneAndUpdate(
        { _id: id, businessId },
        { ...updateClientDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      )

      if (!client) {
        throw new NotFoundException("Client not found")
      }

      return {
        success: true,
        data: client,
        message: "Client updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to update client: ${error.message}`)
    }
  }

  async remove(id: string, businessId: string): Promise<ApiResponse<null>> {
    try {
      const client = await this.clientModel.findOneAndUpdate(
        { _id: id, businessId },
        { isActive: false, updatedAt: new Date() },
        { new: true },
      )

      if (!client) {
        throw new NotFoundException("Client not found")
      }

      return {
        success: true,
        message: "Client deactivated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to deactivate client: ${error.message}`)
    }
  }

  async exportToCSV(businessId: string): Promise<string> {
    try {
      const clients = await this.clientModel.find({ businessId, isActive: true }) as any
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
      })

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
      }))

      await csvWriter.writeRecords(records)
      return "clients-export.csv"
    } catch (error) {
      throw new Error(`Failed to export clients to CSV: ${error.message}`)
    }
  }

  async exportToPDF(businessId: string): Promise<Buffer> {
    try {
      const clients = await this.clientModel.find({ businessId, isActive: true })
      const doc = new PDFDocument()
      const buffers: Buffer[] = []

      doc.on("data", buffers.push.bind(buffers))

      return new Promise((resolve, reject) => {
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)
        })

        doc.on("error", reject)

        doc.fontSize(20).text("Client List", 100, 100)
        doc.moveDown()

        clients.forEach((client, index) => {
          const y = 150 + index * 60
          doc
            .fontSize(12)
            .text(`${client.profile.firstName} ${client.profile.lastName}`, 100, y)
            .text(`Email: ${client.profile.email}`, 100, y + 15)
            .text(`Phone: ${client.profile.phone.number}`, 100, y + 30)
            .text(`Visits: ${client.totalVisits} | Spent: ${client.totalSpent}`, 100, y + 45)
        })

        doc.end()
      })
    } catch (error) {
      throw new Error(`Failed to export clients to PDF: ${error.message}`)
    }
  }

  async importFromCSV(filePath: string, businessId: string): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    try {
      const results: any[] = []
      const errors: string[] = []
      let imported = 0

      return new Promise((resolve, reject) => {
        createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (data) => results.push(data))
          .on("end", async () => {
            for (const row of results) {
              try {
                const clientData: CreateClientDto = {
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
                }

                await this.create(clientData, businessId)
                imported++
              } catch (error) {
                errors.push(`Row ${results.indexOf(row) + 1}: ${error.message}`)
              }
            }

            resolve({
              success: true,
              data: { imported, errors },
              message: `Import completed. ${imported} clients imported successfully.`,
            })
          })
          .on("error", reject)
      })
    } catch (error) {
      throw new Error(`Failed to import clients from CSV: ${error.message}`)
    }
  }

  async getClientStats(businessId: string): Promise<ApiResponse<any>> {
    try {
      const totalClients = await this.clientModel.countDocuments({ businessId }).exec()
      const activeClients = await this.clientModel.countDocuments({ businessId, isActive: true }).exec()
      const newThisMonth = await this.clientModel.countDocuments({
        businessId,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }).exec()

      const topSources = await this.clientModel.aggregate([
        { $match: { businessId, isActive: true } },
        { $group: { _id: "$additionalInfo.clientSource", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])

      return {
        success: true,
        data: {
          totalClients,
          activeClients,
          newThisMonth,
          topSources,
        },
      }
    } catch (error) {
      throw new Error(`Failed to get client stats: ${error.message}`)
    }
  }

  async enableGrokCodeFast1ForAllClients(businessId?: string): Promise<ApiResponse<any>> {
    try {
      const filter: any = {}
      if (businessId) {
        filter.businessId = businessId
      }

      const result = await this.clientModel.updateMany(
        filter,
        {
          $set: {
            "settings.grokCodeFast1Enabled": true,
            updatedAt: new Date(),
          },
        },
      )

      return {
        success: true,
        data: {
          matched: result.matchedCount,
          modified: result.modifiedCount,
        },
        message: `Grok Code Fast 1 enabled for ${result.modifiedCount} client(s)`,
      }
    } catch (error) {
      throw new Error(`Failed to enable Grok Code Fast 1: ${error.message}`)
    }
  }
}