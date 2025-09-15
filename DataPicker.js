'use strict';

class DatePicker {
  /**
   * @param {string} id - id of the container div
   * @param {function} onDateChanged - callback when a date is selected
   */
  constructor(id, onDateChanged) {
    this.id = id;
    this.onDateChanged = onDateChanged;
  }

  /** render calendar for given month */
  render(date) {
    this.renderDate = new Date(date.getTime());

    const container = document.getElementById(this.id);
    container.innerHTML = ''; 

    container.appendChild(this.buildTable());
  }

  /** calendar table */
  buildTable() {
    const table = document.createElement('table');

    table.appendChild(this.getCaption());
    table.appendChild(this.getHeader());
    table.appendChild(this.getBody());

    return table;
  }

  /** month + year */
  getCaption() {
    const caption = document.createElement('caption');
    caption.textContent = this.renderDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
    return caption;
  }

  /** navigation row + weekday row */
  getHeader() {
    const thead = document.createElement('thead');

    // navigation row (← and →)
    const navRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      const th = document.createElement('th');
      if (i === 0) {
        th.textContent = '←';
        th.className = 'month-selector';
        th.onclick = () => {
          this.renderDate.setMonth(this.renderDate.getMonth() - 1);
          this.render(this.renderDate);
        };
      } else if (i === 6) {
        th.textContent = '→';
        th.className = 'month-selector';
        th.onclick = () => {
          this.renderDate.setMonth(this.renderDate.getMonth() + 1);
          this.render(this.renderDate);
        };
      }
      navRow.appendChild(th);
    }
    thead.appendChild(navRow);

    // weekday row
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const daysRow = document.createElement('tr');
    for (const day of weekdays) {
      const th = document.createElement('th');
      th.textContent = day;
      daysRow.appendChild(th);
    }
    thead.appendChild(daysRow);

    return thead;
  }

  /** days grid */
  getBody() {
    const tbody = document.createElement('tbody');
    const month = this.renderDate.getMonth();
    const year = this.renderDate.getFullYear();

    // first visible day (Sunday before or on 1st of month)
    const firstDay = new Date(year, month, 1);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());

    const dayCursor = new Date(firstDay);

    // loop until the full month is shown
    for (let row = 0; row < 6; row++) {
      const tr = document.createElement('tr');

      for (let col = 0; col < 7; col++) {
        const td = document.createElement('td');
        td.textContent = dayCursor.getDate();

        if (dayCursor.getMonth() !== month) {
          td.className = 'not-in-month';
        } else {
          td.onclick = () => {
            this.onDateChanged(this.id, {
              month: dayCursor.getMonth() + 1,
              day: dayCursor.getDate(),
              year: dayCursor.getFullYear()
            });
          };
        }

        tr.appendChild(td);
        dayCursor.setDate(dayCursor.getDate() + 1);
      }

      tbody.appendChild(tr);

      // stop if passed the end of the target month
      if (dayCursor.getMonth() > month && dayCursor.getDate() > 7) break;
    }

    return tbody;
  }
}
