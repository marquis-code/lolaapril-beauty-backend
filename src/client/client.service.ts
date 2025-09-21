import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { Client, ClientDocument } from "./schemas/client.schema"
import type { CreateClientDto } from "./dto/create-client.dto"
import type { UpdateClientDto } from "./dto/update-client.dto"
import type { ClientQueryDto } from "./dto/client-query.dto"
import type { PaginatedResult } from "../../common/dto/pagination.dto"
import * as csvWriter from "csv-writer"
import * as PDFDocument from "pdfkit"

@Injectable()
export class ClientService {
  private clientModel: Model<ClientDocument>

  constructor(clientModel: Model<ClientDocument>) {
    this.clientModel = clientModel
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const client = new this.clientModel(createClientDto)
      return await client.save()
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException("Client with this email already exists")
      }
      throw error
    }
  }

  async findAll(query: ClientQueryDto): Promise<PaginatedResult<Client>> {
    const {
      page = 1,
      limit = 10,
      search,
      gender,
      clientSource,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = {}

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "phone.number": { $regex: search, $options: "i" } },
      ]
    }

    if (gender) filter.gender = gender
    if (clientSource) filter.clientSource = clientSource
    if (isActive !== undefined) filter.isActive = isActive

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 }
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.clientModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.clientModel.countDocuments(filter).exec(),
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec()
    if (!client) {
      throw new NotFoundException("Client not found")
    }
    return client
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    try {
      const client = await this.clientModel
        .findByIdAndUpdate(id, updateClientDto, { new: true, runValidators: true })
        .exec()

      if (!client) {
        throw new NotFoundException("Client not found")
      }

      return client
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException("Client with this email already exists")
      }
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Client not found")
    }
  }

  async exportToCSV(): Promise<Buffer> {
    const clients = await this.clientModel.find({ isActive: true }).exec()

    const csvWriterInstance = csvWriter.createObjectCsvStringifier({
      header: [
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "phone", title: "Phone" },
        { id: "gender", title: "Gender" },
        { id: "clientSource", title: "Source" },
        { id: "totalVisits", title: "Total Visits" },
        { id: "totalSpent", title: "Total Spent" },
        { id: "lastVisit", title: "Last Visit" },
        { id: "createdAt", title: "Created At" },
      ],
    })

    const records = clients.map((client) => ({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: `${client.phone.countryCode} ${client.phone.number}`,
      gender: client.gender || "",
      clientSource: client.clientSource || "",
      totalVisits: client.totalVisits,
      totalSpent: client.totalSpent,
      lastVisit: client.lastVisit ? client.lastVisit.toISOString().split("T")[0] : "",
      createdAt: client.createdAt.toISOString().split("T")[0],
    }))

    const csvString = csvWriterInstance.getHeaderString() + csvWriterInstance.stringifyRecords(records)
    return Buffer.from(csvString, "utf8")
  }

  async exportToPDF(): Promise<Buffer> {
    const clients = await this.clientModel.find({ isActive: true }).exec()

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument()
      const buffers: Buffer[] = []

      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })
      doc.on("error", reject)

      // PDF Header
      doc.fontSize(20).text("Client Directory", 50, 50)
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80)

      let yPosition = 120

      clients.forEach((client, index) => {
        if (yPosition > 700) {
          doc.addPage()
          yPosition = 50
        }

        doc.fontSize(14).text(`${index + 1}. ${client.firstName} ${client.lastName}`, 50, yPosition)
        yPosition += 20

        doc
          .fontSize(10)
          .text(`Email: ${client.email}`, 70, yPosition)
          .text(`Phone: ${client.phone.countryCode} ${client.phone.number}`, 70, yPosition + 15)
          .text(`Gender: ${client.gender || "N/A"}`, 70, yPosition + 30)
          .text(`Total Visits: ${client.totalVisits}`, 70, yPosition + 45)
          .text(`Total Spent: $${client.totalSpent}`, 70, yPosition + 60)

        yPosition += 90
      })

      doc.end()
    })
  }

  async importFromCSV(csvData: Buffer): Promise<{ success: number; errors: string[] }> {
    // Implementation for CSV import would go here
    // This is a placeholder for the import functionality
    return { success: 0, errors: ["Import functionality not yet implemented"] }
  }

  async getClientStats(): Promise<any> {
    const totalClients = await this.clientModel.countDocuments({ isActive: true })
    const newClientsThisMonth = await this.clientModel.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    })

    const genderStats = await this.clientModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ])

    const sourceStats = await this.clientModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$clientSource", count: { $sum: 1 } } },
    ])

    return {
      totalClients,
      newClientsThisMonth,
      genderStats,
      sourceStats,
    }
  }
}
