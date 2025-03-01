import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/pagination.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(
    lpId: number,
    cursorPaginationDto: Omit<CursorPaginationDto, 'search'>,
  ) {
    const post = await this.prisma.lp.findUnique({
      where: { id: lpId },
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    return await this.pagination.paginate('comment', 'id', {
      ...cursorPaginationDto,
      extraWhere: { lpId },
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
      },
    });
  }
}
