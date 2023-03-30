<template>
    <div class="px-5">
        <div>
            <v-row align="center">
                <v-col cols="6" sm="3">
                    <v-select
                    v-model="name"
                    :items="empTotalLeave"
                    item-text="Name"
                    label="Check Emp. Leave"
                    clearable
                    > 
                    ></v-select>
                </v-col>
                <div v-if="name!=null">Total Leave : {{getTotalLeaveByName()}}</div>
            </v-row>
        </div>
    </div>
</template>
<script>
export default {
    props :{
        empTotalLeave : Array
    },
    data() {
        return {
            name : null
        }
    },
    methods: {
        getTotalLeaveByName(){
            let data = this.empTotalLeave.filter((leave) => leave.Name == this.name)
            return data[0]['TotalLeave']
        }
    },
}
</script>
<style lang="">
    
</style>