import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { HeaderComponent } from '../header/header.component';

import ProficiencyFilter from '../filters/proficiencyFilter';
import SkillFilter from '../filters/skillFilter';
import RefData from '../data/refData';

@Component({
  selector: 'app-rich-grid',
  templateUrl: './rich-grid.component.html',
  styleUrls: ['./rich-grid.component.css']
})
export class RichGridComponent implements OnInit {

  private gridOptions: GridOptions;
    public showGrid: boolean;
    public rowData: any[];
    private columnDefs: any[];
    public rowCount: string;

    constructor() {
        // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{};
        this.createRowData();
        this.createColumnDefs();
        this.showGrid = true;
        this.gridOptions.defaultColDef = {
            headerComponentFramework : <{new(): HeaderComponent}>HeaderComponent,
            headerComponentParams : {
                menuIcon: 'fa-bars'
            }
        };
    }

  ngOnInit() {
  }

  private createRowData() {
    const rowData: any[] = [];

    for (let i = 0; i < 200; i++) {
        const countryData = RefData.countries[i % RefData.countries.length];
        rowData.push({
            name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
            skills: {
                android: Math.random() < 0.4,
                html5: Math.random() < 0.4,
                mac: Math.random() < 0.4,
                windows: Math.random() < 0.4,
                css: Math.random() < 0.4
            },
            dob: RefData.DOBs[i % RefData.DOBs.length],
            address: RefData.addresses[i % RefData.addresses.length],
            years: Math.round(Math.random() * 100),
            proficiency: Math.round(Math.random() * 100),
            country: countryData.country,
            continent: countryData.continent,
            language: countryData.language,
            mobile: createRandomPhoneNumber(),
            landline: createRandomPhoneNumber()
        });
    }

    this.rowData = rowData;
  }

  private createColumnDefs() {
      this.columnDefs = [
          {
              headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
              suppressMenu: true, pinned: true
          },
          {
              headerName: 'Employee',
              // headerGroupComponentFramework: HeaderGroupComponent,
              children: [
                  {
                      headerName: 'Name', field: 'name',
                      width: 150, pinned: true
                  },
                  {
                      headerName: 'Country', field: 'country', width: 150,
                      cellRenderer: countryCellRenderer, pinned: true,
                      filterParams: {cellRenderer: countryCellRenderer, cellHeight: 20}, columnGroupShow: 'open'
                  },
                  {
                      headerName: 'DOB', field: 'dob', width: 120, pinned: true, cellRenderer: function(params) {
                      return  pad(params.value.getDate(), 2) + '/' +
                          pad(params.value.getMonth() + 1, 2) + '/' +
                          params.value.getFullYear();
                      }, filter: 'date', columnGroupShow: 'open'
                  }
              ]
          },
          {
              headerName: 'IT Skills',
              children: [
                  {
                      headerName: 'Skills',
                      width: 125,
                      suppressSorting: true,
                      cellRenderer: skillsCellRenderer,
                      filter: SkillFilter
                  },
                  {
                      headerName: 'Proficiency',
                      field: 'proficiency',
                      width: 120,
                      cellRenderer: percentCellRenderer,
                      filter: ProficiencyFilter
                  },
              ]
          },
          {
              headerName: 'Contact',
              children: [
                  {headerName: 'Mobile', field: 'mobile', width: 150, filter: 'text'},
                  {headerName: 'Land-line', field: 'landline', width: 150, filter: 'text'},
                  {headerName: 'Address', field: 'address', width: 500, filter: 'text'}
              ]
          }
      ];
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
        const model = this.gridOptions.api.getModel();
        const totalRows = this.rowData.length;
        const processedRows = model.getRowCount();
        this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  private onModelUpdated() {
    console.log('onModelUpdated');
    this.calculateRowCount();
  }

  private onReady() {
    console.log('onReady');
    this.calculateRowCount();
  }

  private onCellClicked($event) {
    console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellValueChanged($event) {
    console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  private onCellDoubleClicked($event) {
    console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellContextMenu($event) {
    console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellFocused($event) {
    console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  private onRowSelected($event) {
    // taking out, as when we 'select all', it prints to much to the console!!
    // console.log('onRowSelected: ' + $event.node.data.name);
  }

  private onSelectionChanged() {
    console.log('selectionChanged');
  }

  private onBeforeFilterChanged() {
    console.log('beforeFilterChanged');
  }

  private onAfterFilterChanged() {
    console.log('afterFilterChanged');
  }

  private onFilterModified() {
    console.log('onFilterModified');
  }

  private onBeforeSortChanged() {
    console.log('onBeforeSortChanged');
  }

  private onAfterSortChanged() {
    console.log('onAfterSortChanged');
  }

  private onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  private onRowClicked($event) {
    console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  private onColumnEvent($event) {
    console.log('onColumnEvent: ' + $event);
  }

}

function skillsCellRenderer(params) {
  const data = params.data;
  const skills = [];
  RefData.IT_SKILLS.forEach(function (skill) {
      if (data && data.skills && data.skills[skill]) {
          skills.push('<img src="http://www.ag-grid.com/images/skills/' + skill + '.png" width="16px" title="' + skill + '" />');
      }
  });
  return skills.join(' ');
}

function countryCellRenderer(params) {
  const flag = '<img border=\'0\' width=\'15\' height=\'10\' style=\'margin-bottom: 2px\' src=\'http://www.ag-grid.com/images/flags/'
  + RefData.COUNTRY_CODES[params.value] + '.png\'>';
  return flag + ' ' + params.value;
}

function createRandomPhoneNumber() {
  let result = '+';
  for (let i = 0; i < 12; i++) {
      result += Math.round(Math.random() * 10);
      if (i === 2 || i === 5 || i === 8) {
          result += ' ';
      }
  }
  return result;
}

function percentCellRenderer(params) {
  const value = params.value;

  const eDivPercentBar = document.createElement('div');
  eDivPercentBar.className = 'div-percent-bar';
  eDivPercentBar.style.width = value + '%';
  if (value < 20) {
      eDivPercentBar.style.backgroundColor = 'red';
  } else if (value < 60) {
      eDivPercentBar.style.backgroundColor = '#ff9900';
  } else {
      eDivPercentBar.style.backgroundColor = '#00A000';
  }

  const eValue = document.createElement('div');
  eValue.className = 'div-percent-value';
  eValue.innerHTML = value + '%';

  const eOuterDiv = document.createElement('div');
  eOuterDiv.className = 'div-outer-div';
  eOuterDiv.appendChild(eValue);
  eOuterDiv.appendChild(eDivPercentBar);

  return eOuterDiv;
}

// Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
  let asString = num + '';
  while (asString.length < totalStringSize) { asString = '0' + asString; }
  return asString;
}
