import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  config = new MatSnackBarConfig();
  constructor(private snackBar: MatSnackBar) {
    this.config.horizontalPosition = 'right';
    this.config.verticalPosition = 'top';
  }

  Error(message: string, buttonText: string, duration: number) {
      this.config.panelClass = 'error-snack-bar';
      this.config.duration = duration;
      this.snackBar.open(message, buttonText, this.config);
   }

  Caution(message: string, buttonText: string, duration: number) {
    this.config.panelClass = 'caution-snack-bar';
    this.config.duration = duration;
    this.snackBar.open(message, buttonText, this.config);
  }

  Success(message: string, buttonText: string, duration: number) {
    this.config.panelClass = 'success-snack-bar';
    this.config.duration = duration;
    this.snackBar.open(message, buttonText, this.config);
 }
}
