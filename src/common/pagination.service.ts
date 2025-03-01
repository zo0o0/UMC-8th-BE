import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate(
    model: keyof PrismaService, // Prisma 모델을 안전하게 받음
    cursorField: string, // 커서 필드 (id 등)
    paginationDto: {
      cursor?: string | number;
      limit?: string | number;
      search?: string; // 검색 기능 추가
      extraWhere?: Record<string, any>; // 추가 필터 조건 (특정 userId 등)
      include?: Record<string, any>; // 관계를 포함할 옵션
    },
  ): Promise<{
    data: any[];
    nextCursor: string | number | null;
    hasNext: boolean;
  }> {
    // cursor와 limit이 문자열일 경우 숫자로 변환
    const limitValue =
      typeof paginationDto.limit === 'string'
        ? parseInt(paginationDto.limit, 10)
        : (paginationDto.limit ?? 10);
    const cursorValue =
      typeof paginationDto.cursor === 'string'
        ? parseInt(paginationDto.cursor, 10)
        : paginationDto.cursor;

    // 커서 조건 추가 (cursor가 제공된 경우)
    const cursorCondition =
      cursorValue !== undefined ? { [cursorField]: { gt: cursorValue } } : {};

    // PrismaService에 해당 모델이 존재하는지 확인
    if (!(model in this.prisma)) {
      throw new Error(`Invalid model: ${String(model)}`);
    }
    const prismaModel = this.prisma[model] as any;

    // 검색 가능한 필드 정의 (모델별로 동적으로 지정)
    const searchableFields: Record<string, string[]> = {
      lp: ['title'],
    };

    const searchFields = searchableFields[String(model)] || [];

    // 검색 조건 추가 (해당 모델의 필드에서 검색할 수 있도록)
    const searchCondition =
      searchFields.length && paginationDto.search
        ? {
            OR: searchFields.map((field) => ({
              [field]: { contains: paginationDto.search },
            })),
          }
        : {};

    // 모든 조건 병합
    const finalWhere = {
      ...searchCondition,
      ...cursorCondition,
      ...paginationDto.extraWhere,
    };

    try {
      const results = await prismaModel.findMany({
        where: finalWhere, // 동적으로 where 조건 추가
        take: limitValue + 1, // hasNext 확인을 위해 limit+1개 조회
        orderBy: { [cursorField]: 'asc' },
        include: paginationDto.include, // 관계 옵션 전달
      });

      const hasNext = results.length > limitValue;
      if (hasNext) {
        results.pop();
      }

      return {
        data: results,
        nextCursor: results.length
          ? results[results.length - 1][cursorField]
          : null,
        hasNext,
      };
    } catch (error) {
      console.error('Prisma findMany error:', error);
      throw new Error('Database query failed');
    }
  }
}
