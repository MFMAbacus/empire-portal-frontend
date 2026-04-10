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

export const getActivity = (id: string): CompoundActivityRecord | null => {
  const activity = activities.records.find((current) => {
    return current.id === id;
  });
  if (typeof activity === 'undefined') {
    return null;
  }
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
};
