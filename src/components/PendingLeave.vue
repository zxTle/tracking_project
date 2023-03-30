<template>
    <div>
        <v-card-title class="text-h5 text-lg-h5  pl-6 pt-6">YOUR PENDING LEAVE DAYS FOR APPROVAL</v-card-title>
        <div>
        <v-divider class="mx-5"></v-divider>
            <v-data-table
                show-select
                v-model="selected"
                :single-select=true
                :headers="tableHeader"
                :items="pendingDataShow"
                :items-per-page="isMobile?2:5"
                item-key="index"
                mobile-breakpoint="0"
                class="elevation-1 data-table ">
            </v-data-table> 
        </div>
        <v-row class="pt-5">
            <v-col align="right">
                <v-btn 
                :disabled="pendingData.length==0 || selected.length == 0"
                color="error"
                class="mr-2 mb-2 mt-1"
                rounded
                @click="cancel">Cancel leave</v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { leaveSheetUrl } from '@/store/constants';
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
    props : {
        name :String,
        pendingData:Array,
        isMobile : Boolean
    },
    data() {
        return {
            tableHeader: [
            {text: 'No.', value: 'index', align: 'center'},
            {text: 'Date (from)', value: 'date(from)', align: 'center'},
            {text: 'Date (to)', value: 'date(to)', align: 'center'},
            {text: 'Number of days', value: 'number of days', align: 'center'},
            {text: 'Type', value: 'type', align: 'center'},
            {text: 'Remark', value: 'remark', align: 'center'}],
            selected : [],
            pendingDataShow : this.pendingData
        }
    },
    methods: {
        async cancel(){
            let msg = "Date : " + this.selected[0]['date(from)'];
            if(this.selected[0]['number of days'] > 1) msg+= " - " + this.selected[0]['date(to)'] + '<br>' + this.selected[0].type + '<br>' + this.selected[0].remark;
            else msg+= '<br>' + this.selected[0].type + '<br>' + this.selected[0].remark;
            Swal.fire({
                title : 'Do you want to cancel this leave?',
                html : msg,
                showCancelButton : true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                cancelButtonColor : "#dc143c"
            }).then(async (result)=>{
                if(result.isConfirmed){
                    this.$store.commit('general/setLoading', true)
                    let newStatus = {status :"cancel"}
                    await axios.patch(leaveSheetUrl + `/tabs/leaveFormResponses/search?name=${this.selected[0].name}&date(from)=${this.selected[0]['date(from)']}&date(to)=${this.selected[0]['date(to)']}`, newStatus)
                    let cancelIndex = this.selected[0].index;
                    this.selected = []
                    this.pendingDataShow.splice(cancelIndex-1,1)
                    let newIndex = 1;
                    this.pendingData.forEach(record => {
                        record['index'] = newIndex;
                        newIndex++
                    });
                    this.$store.commit('general/setLoading', false)
                }
            })
        }
    },
}
</script>
