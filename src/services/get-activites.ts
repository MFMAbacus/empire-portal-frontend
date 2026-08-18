import {CompoundActivityRecord} from '@/types/activities';

import {getActivitiesTypes} from './get-activites-types';
import {getActivitiesPriorities} from './get-activites-priorities';
import {getActivitiesStatuses} from './get-activites-statuses';
import {getActivitiesCategories} from './get-activites-categories';
import {getStaff} from './get-staff';
import {getCustomers} from './get-customers';

import {activities} from '@/data/activities';

const activitiesTypes = getActivitiesTypes();
const activitiesPriorities = getActivitiesPriorities();
const activitiesStatuses = getActivitiesStatuses();
const activitiesCategories = getActivitiesCategories();
const staff = getStaff();
const customers = getCustomers();

type GetActivitiesArgs = {
  id: string | null;
  typeId: string | null;
  priorityId: string | null;
  statusId: string | null;
};

export const getActivities = ({
  id,
  typeId,
  priorityId,
  statusId,
}: GetActivitiesArgs): CompoundActivityRecord[] => {
  return activities.records
      .filter((activity) => {
        if (id === null) {
          return true;
        }
        return activity.id.match(id);
      })
      .filter((activity) => {
        if (typeId === null) {
          return true;
        }
        return activity.typeId === typeId;
      })
      .filter((activity) => {
        if (priorityId === null) {
          return true;
        }
        return activity.priorityId === priorityId;
      })
      .filter((activity) => {
        if (statusId === null) {
          return true;
        }
        return activity.statusId === statusId;
      })
      .map((activity) => {
        return {
          ...activity,
          type: (() => {
            const type = activitiesTypes.find((activityType) => {
              return activityType.id === activity.typeId;
            });
            if (typeof type === 'undefined') {
              throw new Error('Data construction error.');
            }
            return type;
          })(),
          priority: (() => {
            const priority = activitiesPriorities.find((activityPriority) => {
              return activityPriority.id === activity.priorityId;
            });
            if (typeof priority === 'undefined') {
              throw new Error('Data construction error.');
            }
            return priority;
          })(),
          status: (() => {
            const status = activitiesStatuses.find((activityStatus) => {
              return activityStatus.id === activity.statusId;
            });
            if (typeof status === 'undefined') {
              throw new Error('Data construction error.');
            }
            return status;
          })(),
          category: (() => {
            const category = activitiesCategories.find((activityCategory) => {
              return activityCategory.id === activity.categoryId;
            });
            if (typeof category === 'undefined') {
              throw new Error('Data construction error.');
            }
            return category;
          })(),
          assignedTo: (() => {
            const worker = staff.find((worker) => {
              return worker.id === activity.assigendToId;
            });
            if (typeof worker === 'undefined') {
              return null;
            }
            return worker;
          })(),
          customer: (() => {
            const customer = customers.find((customer) => {
              return customer.id === activity.customerId;
            });
            if (typeof customer === 'undefined') {
              return null;
            }
            return customer;
          })(),
        };
      });
};
