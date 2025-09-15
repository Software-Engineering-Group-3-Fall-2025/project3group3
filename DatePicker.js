'use strict';

class DatePicker {
  constructor(id, onDateChanged) {
    this.id = id;
    this.onDateChanged = onDateChanged;
  }

  /** caption row (month + year) */
  getTableCaption() {
    const caption = document.createElement("caption");
    const month = this.renderDate.toLocaleString("default", { month: "long" });
    const year = this.renderDate.getFullYear();
    caption.appendChild(document.createTextNode(`${month} ${year}`));
    return caption;
  }

  /** generic row builder */
  getRow(values, rowType) {
    const row = document.createElement("tr");
    for (let i = 0; i < values.length; i++) {
      const cell = document.createElement(rowType);
      cell.appendChild(document.createTextNode(values[i].value));
      if (values[i].active) {
        // Clickable date
        const fixedDate = {
          month: this.renderDate.getMonth() + 1,
          day: values[i].value,
          year: this.renderDate.getFullYear()
        };
        cell.onclick = () => this.onDateChanged(this.id, fixedDate);
      } else {
        cell.setAttribute("class", "not-in-month");
      }
      row.appendChild(cell);
    }
    return row;
  }

  /** ← and → navigation row data */
  static getHeaderRow1Data() {
    return [
      { value: "←", active: true },
      { value: "\u00A0", active: false },
      { value: "\u00A0", active: false },
      { value: "\u00A0", active: false },
      { value: "\u00A0", active: false },
      { value: "\u00A0", active: false },
      { value: "→", active: true }
    ];
  }

  /** weekday labels row data */
  static getHeaderRow2Data() {
    return [
      { value: "Su", active: false },
      { value: "Mo", active: false },
      { value: "Tu", active: false },
      { value: "We", active: false },
      { value: "Th", active: false },
      { value: "Fr", active: false },
      { value: "Sa", active: false }
    ];
  }

  /** build the table header */
  getTableHeader() {
    const header = document.createElement("thead");
    const date = this.renderDate;

    // navigation row
    const navRow = this.getRow(DatePicker.getHeaderRow1Data(), "th");
    navRow.children[0].setAttribute("class", "month-selector");
    navRow.children[0].onclick = () => {
      date.setMonth(date.getMonth() - 1);
      this.render(date);
    };
    navRow.children[6].setAttribute("class", "month-selector");
    navRow.children[6].onclick = () => {
      date.setMonth(date.getMonth() + 1);
      this.render(date);
    };

    header.appendChild(navRow);
    header.appendChild(this.getRow(DatePicker.getHeaderRow2Data(), "th"));
    return header;
  }

  getTableBody() {
    const tbody = document.createElement("tbody");
    const month = this.renderDate.getMonth();
    const year = this.renderDate.getFullYear();

    // first visible day (Sunday on or before 1st of month)
    const start = new Date(year, month, 1);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(year, month + 1, 0); // last day of current month
    end.setDate(end.getDate() + (6 - end.getDay())); // include remaining days in last week

    const cursor = new Date(start);

    while (cursor <= end) {
        const rowData = [];
        for (let col = 0; col < 7; col++) {
            rowData.push({
                value: cursor.getDate(),
                active: cursor.getMonth() === month
            });
            cursor.setDate(cursor.getDate() + 1);
        }
        tbody.appendChild(this.getRow(rowData, "td"));
    }

    return tbody;
}

  /** full table builder */
  getTable() {
    const table = document.createElement("table");
    table.appendChild(this.getTableCaption());
    table.appendChild(this.getTableHeader());
    table.appendChild(this.getTableBody());
    return table;
  }

  /** render entry point */
  render(date) {
    this.renderDate = new Date(date.getTime());
    const container = document.getElementById(this.id);
    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(this.getTable());
  }
}
