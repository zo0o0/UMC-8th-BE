import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { PaginationService } from 'src/common/pagination.service';
import { CreateLpsDto } from 'src/lps/dto/create-lps.dto';
import { UpdateLpsDto } from 'src/lps/dto/update-lps.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LpsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(cursorPaginationDto: CursorPaginationDto) {
    return await this.pagination.paginate('lp', 'id', cursorPaginationDto);
  }

  async findByUser({
    cursorPaginationDto,
    userId,
  }: {
    cursorPaginationDto: CursorPaginationDto;
    userId: number;
  }) {
    return await this.pagination.paginate('lp', 'id', {
      ...cursorPaginationDto,
      extraWhere: {
        authorId: userId,
      },
    });
  }

  async findOne(lpsId: number) {
    return await this.prisma.lp.findUnique({
      where: {
        id: lpsId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        tags: true,
      },
    });
  }

  async create({
    userId,
    createLpsDto,
  }: {
    userId: number;
    createLpsDto: CreateLpsDto;
  }) {
    return await this.prisma.lp.create({
      data: {
        ...createLpsDto,
        author: {
          connect: {
            id: userId,
          },
        },
        tags: {
          connectOrCreate: createLpsDto.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }

  async update({
    userId,
    lpsId,
    updateLpsDto,
  }: {
    userId: number;
    lpsId: number;
    updateLpsDto: UpdateLpsDto;
  }) {
    const findLp = await this.prisma.lp.findUnique({
      where: {
        id: lpsId,
      },
    });

    if (!findLp) {
      throw new UnauthorizedException('해당 LP를 찾을 수 없습니다.');
    }

    const authorIdMatched = await this.prisma.lp.findUnique({
      where: { id: lpsId, authorId: userId },
    });

    if (!authorIdMatched) {
      throw new UnauthorizedException('삭제할 수 있는 권한이 없습니다.');
    }

    return await this.prisma.lp.update({
      where: {
        id: lpsId,
      },
      data: {
        ...updateLpsDto,
        tags: {
          set: [],
          connectOrCreate: updateLpsDto.tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async delete({ lpsId, userId }: { lpsId: number; userId: number }) {
    const findLp = await this.prisma.lp.findUnique({
      where: {
        id: lpsId,
      },
    });

    if (!findLp) {
      throw new UnauthorizedException('해당 LP를 찾을 수 없습니다.');
    }

    const authorIdMatched = await this.prisma.lp.findUnique({
      where: { id: lpsId, authorId: userId },
    });

    if (!authorIdMatched) {
      throw new UnauthorizedException('삭제할 수 있는 권한이 없습니다.');
    }

    const result = await this.prisma.lp.delete({
      where: {
        id: lpsId,
        authorId: userId,
      },
    });

    return !!result;
  }

  async findByTag({
    tagName,
    cursorPaginationDto,
  }: {
    tagName: string;
    cursorPaginationDto: CursorPaginationDto;
  }) {
    return await this.pagination.paginate('lp', 'id', {
      ...cursorPaginationDto,
      extraWhere: {
        tags: {
          some: { name: tagName },
        },
      },
    });
  }
}
