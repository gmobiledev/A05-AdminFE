import { KeyedRead } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InventoryService } from "app/auth/service/inventory.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
    selector: 'app-ton-kho',
    templateUrl: './ton-kho.component.html',
    styleUrls: ['./ton-kho.component.scss'],
})
export class TonKhoComponent implements OnInit {
    @BlockUI('section-block') sectionBlockUI: NgBlockUI;
    public contentHeader = {
        headerTitle: 'Báo cáo tồn kho',
        actionButton: true,
        breadcrumb: {
            type: '',
            links: [
                {
                    name: 'Home',
                    isLink: true,
                    link: '/'
                },
                {
                    name: 'Báo cáo tồn kho',
                    isLink: false
                }
            ]
        }
    };
    list = [];
    public searchForm = {
        page: 1,
        date: '',
        page_size: 15,
        startDate: '',
        endDate: '',
        keyword: "",
        channel_id: 132
    }
    totalItems = 0;
    sumItems = {}

    constructor(
        private readonly inventoryServie: InventoryService,
        private readonly alertService: SweetAlertService,
        private activeRouted: ActivatedRoute
    ) {
        this.activeRouted.queryParams.subscribe(params => {
            this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
            this.searchForm.date = params['date'] && params['date'] != undefined ? params['date'] : '';
            this.getData();
        })
    }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.sectionBlockUI.start();
        this.inventoryServie.reportInventory(this.searchForm).subscribe(res => {
            this.sectionBlockUI.stop();
            console.log(res);
            this.list = res['data']['items']
            this.totalItems = res['data']['count']
            this.sumItems = this.sum(this.list)
            console.log("xxxxxxxxxxxxxxxxxxxxxxx", this.sumItems);
        }, error => {
            this.sectionBlockUI.stop();
            this.alertService.showMess(error);
        });
    }

    sum(data) {
        var total = {}
        data.forEach(item => {
            for (const key of Object.keys(item)) {
                console.log("item", typeof total[key])
                if (!total[key])
                    total[key] = 0
                if (item[key])
                    total[key] += parseInt(item[key] || "0");
            }
        });
        return total;
    }

    loadPage(page) {
        this.searchForm.page = page;
        this.getData();
    }


    exportExcelReport() {
        this.inventoryServie.reportInventoryExcel(this.searchForm).subscribe(res => {
            var newBlob = new Blob([res.body], { type: res.body.type });
            let url = window.URL.createObjectURL(newBlob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = "Báo cáo tồn kho";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
    }


    exportExcelReportDetail(number) {
        let data = {
            "dau_so": number,
            "channel_id": this.searchForm.channel_id
        }
        this.inventoryServie.reportInventoryExcelDetail(data).subscribe(res => {
            var newBlob = new Blob([res.body], { type: res.body.type });
            let url = window.URL.createObjectURL(newBlob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = "Báo cáo chi tiết đầu số";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
    }
}