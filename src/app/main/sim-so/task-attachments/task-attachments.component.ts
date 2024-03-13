import { Component, Input, OnInit } from '@angular/core';
import { FileServive } from 'app/auth/service/file.service';

@Component({
  selector: 'app-task-attachments',
  templateUrl: './task-attachments.component.html',
  styleUrls: ['./task-attachments.component.scss']
})
export class TaskAttachmentsComponent implements OnInit {

  @Input() task_id;
  @Input() entity;
  @Input() key;

  public listFiles;

  constructor(
    private fileService: FileServive
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    if(this.task_id) {
      let data = {
        entity: this.entity,
        object_id: this.task_id,
        key: this.key
      }
      this.fileService.viewFiles(data).subscribe(res => {
        this.listFiles = res.data
      })
    }
  }

}
