import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../models/customer';
import { Sample } from '../models/sample';
import { CustomerService } from '../services/customer.service';
//import { SampleService } from '../services/sample.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer:Customer;
  customers:Customer[];
  sample:Sample;
  samples:Sample[];

  constructor(private httpClient: HttpClient,private router:Router,
    private customerService:CustomerService,) {
  
    this.customer = new Customer();
    this.customers = []; 
    this.sample = new Sample();
    this.samples = [];
   }

  ngOnInit(): void {
    this.fetchSample();
    this.fetchCustomer();
  }
  reloadData() {
    this.customer= new Customer();
    this.fetchSample();
    this.fetchCustomer();
}

fetchCustomer() {
  this.customerService.getCustomer().subscribe(
  (data) => {
    this.customers = data;
  },
  (err) => {
    console.log(err);
  }
);  
}
fetchSample() {
  this.customerService.getSample().subscribe(
    (data) => {
      this.samples = data;
    },
    (err) => {
      console.log(err);
    }
  );
}
validateCustomerData(): boolean {
  let flag = false;
 if (this.customer.sampleDate == '') {
    alert('Please enter the name');
  }
  else if (this.customer.customerName == '') {
    alert('Please enter the name');
  }else {
    flag = true;
  }
  return flag;
}
onRegister() {
  if (this.validateCustomerData()) {
    console.log('Checkpoint 1');
    //asynchronous vs synchronous programming
    this.customerService.createCustomer(this.customer).subscribe(
      (data) => {
        if (data) {
          console.log('Checkpoint 3');
          //increment hotel reference
          this.customerService.incrementSampleNoReference().subscribe(
            (data) => {
              if (data) {
                //reload data since new record has been added
                this.reloadData();
              } else {
                alert('Error while incrementing master number');
              }
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          alert(
            'Error while creating hotel. Please look onto the backend logs'
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('Checkpoint 2');
  }
}
}



