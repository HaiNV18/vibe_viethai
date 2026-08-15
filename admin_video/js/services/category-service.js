// CategoryService — Category business logic

import { CategoryRepository } from '../repositories/category-repository.js';

export class CategoryService {
  static getCategories() {
    return CategoryRepository.findAll();
  }
}
