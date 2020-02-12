import { TestBed } from '@angular/core/testing';

import { TodoslistService } from './todoslist.service';

describe('TodoslistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodoslistService = TestBed.get(TodoslistService);
    expect(service).toBeTruthy();
  });
});
