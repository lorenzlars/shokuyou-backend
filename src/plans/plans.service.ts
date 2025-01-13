import { Injectable } from '@nestjs/common';
import { PlanRequestDto } from './dto/planRequest.dto';

@Injectable()
export class PlansService {
  create(_planRequestDto: PlanRequestDto) {
    return 'This action adds a new plan';
  }

  findAll() {
    return `This action returns all plans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, _planRequestDto: PlanRequestDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
