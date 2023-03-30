<template >
    <div >
        <v-card-title class="text-h5 text-sm-h4 pl-6 pt-6">SUMMARY LEAVE DAYS OF {{ name }}</v-card-title>
        <div class="pl-6 pb-6">
            <h2>Total remaining leave days : {{ leaveData.totalRemaining }}</h2>
            <div class="py-3">
                <h4>Used Sick Leave (Have a Medical Certificate) : {{ leaveData.remainingData['Amount of Sick Leave (Have a Medical Certificate)'] - leaveData.remainingData['Sick Leave (Have a Medical Certificate)'] }} </h4>
                <h4>Remaining Sick Leave (Not have a Medical Certificate) : {{ leaveData.remainingData['Sick Leave (Not have a Medical Certificate)'] }}
                    ( max : {{ leaveData.remainingData['Amount of Sick Leave (Not have a Medical Certificate)'] }} )
                </h4>
                <h4>Remaining Personal Leave : {{ leaveData.remainingData['Personal Leave'] }} ( max : {{ leaveData.remainingData['Amount of Personal Leave'] }})</h4>
                <h4>Remaining Vacation Leave : {{ leaveData.remainingData['Vacation Leave'] }} ( max : {{ leaveData.remainingData['Amount of Vacation Leave']}} )</h4>   
            </div>
            <div>
                <v-row>
                    <v-col cols="6" sm="6">
                        <v-select
                        v-model="type"
                        :items="types"
                        label="Fliter Leave Type"
                        clearable
                        > 
                        ></v-select>
                    </v-col>
                </v-row>
            </div>
        </div>
        <div>
        <v-divider class="mx-5"></v-divider>
            <v-data-table
                    :search="type"
                    :headers="tableHeader"
                    :items="leaveData.leaveData"
                    :items-per-page="isMobile?2:5"
                    items-key="index"
                    mobile-breakpoint="0"
                    class="elevation-1 data-table">
            </v-data-table> 
        </div>
    </div>
</template>

<script>

export default {
    props : {
        name :String,
        leaveData : Object,
        isMobile : Boolean
    },
    data() {
        return {
            tableHeader: [
            {text: 'No', value: 'index', align: 'center'},
            {text: 'Date (from)', value: 'date(from)', align: 'center'},
            {text: 'Date (to)', value: 'date(to)', align: 'center'},
            {text: 'Number of days', value: 'number of days', align: 'center'},
            {text: 'Type', value: 'type', align: 'center'},
            {text: 'Remark', value: 'remark', align: 'center'}],
            types :["Personal Leave", "Vacation Leave", "Sick Leave (Have a Medical Certificate)", "Sick Leave (Not have a Medical Certificate)"],
            type :'',
        }
    },
}
</script>
