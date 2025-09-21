import { Controller, Get, Post, Patch, Param, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { VoucherService } from "./voucher.service"
import type { CreateVoucherDto, ApplyVoucherDto } from "./dto/create-voucher.dto"

@ApiTags("vouchers")
@Controller("vouchers")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  @ApiOperation({ summary: "Create a new voucher" })
  @ApiResponse({ status: 201, description: "Voucher created successfully" })
  create(createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all active vouchers" })
  findAll() {
    return this.voucherService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get voucher by ID' })
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get voucher by code' })
  findByCode(@Param('code') code: string) {
    return this.voucherService.findByCode(code);
  }

  @Post("validate")
  @ApiOperation({ summary: "Validate voucher for order" })
  validateVoucher(applyVoucherDto: ApplyVoucherDto) {
    return this.voucherService.validateVoucher(applyVoucherDto)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update voucher" })
  update(@Param('id') id: string, updateData: Partial<CreateVoucherDto>) {
    return this.voucherService.update(id, updateData)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete voucher' })
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id);
  }
}
