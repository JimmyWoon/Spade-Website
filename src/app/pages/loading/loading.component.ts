import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  loading = false;

  // Simulate an asynchronous action
  performActionInBackground() {
    this.loading = true;
    setTimeout(() => {
      // Your background action here
      this.loading = false; // Hide the loading screen when the action is complete
    }, 2000); // Simulated delay for demonstration purposes
  }
}
