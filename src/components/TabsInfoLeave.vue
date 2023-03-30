<template >
    <v-card :class="isMobile?'pa-5 rounded-lg':'px-8 py-2 rounded-lg'" :elevation="6" width="800" >
        <div v-if="!access" >
            <v-card-title class="text-h5 text-sm-h4 pl-6 pt-6">VIEW YOUR LEAVE DAYS INFORMATION</v-card-title>
            <div class="d-flex flex-row align-baseline pl-6"  v-if="!access">
                <div class="mr-5">
                    <div style="max-width: 300px">
                        <v-otp-input length="6" v-model="inputotp" :disabled="!clickRqOTP"></v-otp-input>
                    </div>

                </div>
                <v-btn outlined class="rounded-pill" color="indigo" v-if="!clickRqOTP" @click="requestOtp" :loading="isLoading">Request OTP</v-btn>
                <v-btn outlined class="rounded-pill" color="indigo" v-if="clickRqOTP" @click="confirm_otp" :loading="isLoading">Confirm</v-btn>
            </div>
        </div>
        <v-tabs v-if="access" centered>
            <v-tabs-slider color="indigo"/>
            <v-tab>Pending leave days</v-tab>
            <v-tab>View Summary Leave Days</v-tab>
            <v-tab-item>
                <PendingLeave :name ="name" :pendingData="pendingData" :isMobile="isMobile"></PendingLeave>
            </v-tab-item>
            <v-tab-item>
                <TotalLeaveCard :name="name" :leaveData="allLeaveData" :isMobile="isMobile"/>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>
<script>
import TotalLeaveCard from './TotalLeaveCard.vue';
import PendingLeave from './PendingLeave.vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { leaveSheetUrl } from '../store/constants';
export default {
    computed:{
        isMobile() {
            return this.$vuetify.breakpoint.mobile
        }
    },
    data() {
        return {
            clickRqOTP : false,
            otp:'',
            inputotp :'',
            access : false,
            isLoading : false,
            allLeaveData :{
                leaveData : [],
                remainingData : {},
                totalRemaining : 0,
                allTotalLeave : 0 
            },
            pendingData :[],
            count : 0
        }
    },
    props : {
        name :String,
    },
    components : {
        TotalLeaveCard,
        PendingLeave
    },
    methods: {
        generateOtp(){
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++ ) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return OTP;
        },
        async requestOtp(){
            this.isLoading=!this.isLoading
            this.otp = this.generateOtp()
            let personData = await axios.get(leaveSheetUrl + `/tabs/nameSheet/search?name=${this.name}`)
            let email = personData.data[0]['email']
            // let dataSendMail = {
            //     name : this.name,
            //     otp : this.otp,
            //     email : email
            // }
            let result = await axios({
                method : 'GET',
                url : `https://tracking.ksta.co/test.php?name=${this.name}&otp=${this.otp}&email=${email}`,
                //data :dataSendMail,
            })
            this.clickRqOTP=!this.clickRqOTP
            this.isLoading=!this.isLoading
        },

        async confirm_otp(){
            this.isLoading=!this.isLoading
            if(this.inputotp == this.otp){
                this.inputotp = ''
                await this.getRemainingLeave()
                await this.getLeaveHistory()
                await this.getPendingLeave()
                this.access = !this.access
                this.count = 0
            } 
            else {
                ++this.count
                if(this.count < 3){
                    Swal.fire({
                        title : "Can't access data.",
                        text : 'Wrong OTP Please Try Again',
                        icon : 'warning',
                        confirmButtonText : 'OK'
                    });
                }
                else{
                    Swal.fire({
                        title : "Can't access data.",
                        text : 'Wrong OTP out of limits,\nPlease request new OTP and try again.',
                        icon : 'error',
                        confirmButtonText : 'OK'
                    });
                    this.clickRqOTP = !this.clickRqOTP
                }
            }
            this.inputotp = ''
            this.isLoading = !this.isLoading
        },
        async getRemainingLeave(){
            let remaining = await axios.get(leaveSheetUrl + `/tabs/Remaining Leave Days/search?Name=${this.name}`)
            this.allLeaveData.remainingData = remaining.data[0]
            this.allLeaveData.totalRemaining = parseInt(this.allLeaveData.remainingData['Personal Leave']) + parseInt(this.allLeaveData.remainingData['Sick Leave (Not have a Medical Certificate)']) + parseInt(this.allLeaveData.remainingData['Vacation Leave'])
        },
        async getLeaveHistory(){
            let leaveDays = await axios.get(leaveSheetUrl + `/tabs/leaveFormResponses/query?name=__eq(${this.name})&status=__eq(${'approved'})`)
            let i = 1
            if (leaveDays.data.length > 0){
                for (const row of leaveDays.data){
                    row['index'] = i
                    this.allLeaveData.leaveData.push(row)
                    i++
                }    
            }else{
                this.allLeaveData.leaveData = []
            }
        },
        async getPendingLeave(){
            let leavePending = await axios.get(leaveSheetUrl + `/tabs/leaveFormResponses/query?name=__eq(${this.name})&status=__eq(${'pending'})`)
            let i = 1
            if (leavePending.data.length > 0){
                for (const row of leavePending.data){
                    row['index'] = i
                    this.pendingData.push(row)
                    i++
                }    
            }else{
                this.pendingData = []
            }
        }
    },
    watch:{
        name(){
            if(this.access == true) this.access = !this.access
            if(this.clickRqOTP == true) this.clickRqOTP = !this.clickRqOTP
            this.pendingData = []
            this.allLeaveData.leaveData = []
        }
    }
}
</script>
