import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Grid} from '@/components/base/grid';
import {TextInput} from '@/components/base/text-input';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {PlusIcon} from '@/components/icons/plus-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeCreateVehicleService} from '@/services/create-vehicle-service';
import { GetVehicleTypeMasterServiceApi } from "@/services/get-vehicle-type-master-service";
import { ListInput } from "@/components/base/list-input";
import { Map } from "@/components/base/map";

type CreateVehicleModalProps = {
  sessionId: string;
  customerId: string;
  onSuccess: () => void;
  onClose: () => void;
};

type VehicleTypeItem = {
  id?: string;
  vehicleTypeId?: string;
  vehicleType?: string;
  [key: string]: any;
};

type VehicleOption = {
  id: string;
  label: string;
};

export const CreateVehicleModal = ({
  sessionId,
  customerId,
  onSuccess,
  onClose,
}: CreateVehicleModalProps): JSX.Element => {
  const [
    palletNumber,
    setPalletNumber,
  ] = React.useState<string>('');

  const [
    model,
    setModel,
  ] = React.useState<string>('');

  const [
    type,
    setType,
  ] = React.useState<string>('');

  const [vehicleTypeName, setVehicleTypeName] = React.useState<string>("");
  const [vehicleList, setVehicleList] = React.useState<VehicleTypeItem[]>([]);

  const [isLoadingVehicles, setIsLoadingVehicles] = React.useState<boolean>(false);

  const [
    color,
    setColor,
  ] = React.useState<string>('');

  const [
    isSuccess,
    setIsSuccess,
  ] = React.useState<boolean>(false);

  const {
    startTimeout,
  } = useTimeout();


  // Fetch Vehicle Type Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetVehicleTypeMasterServiceApi();
    const fetchVehicleMaster = async () => {
      setIsLoadingVehicles(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);
        if (isMounted && response && response.data) {
          const items: VehicleTypeItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];
          setVehicleList(items);
        }
      } catch (error) {
        console.error("Failed to fetch vehicle type master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingVehicles(false);
        }
      }
    };

    fetchVehicleMaster();

    return () => {
      isMounted = false;
      service.abort();
    };
  }, [sessionId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onSuccess();
      onClose();
    }, delayAfterSuccess);
  }, [
    startTimeout,
    onSuccess,
    onClose,
  ]);

  const {
    isLoading,
    alertData,
    validation,
    submit,
  } = useForm({
    serviceMaker: makeCreateVehicleService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      customerId,
      palletNumber,
      model,
      type,
      vehicleTypeName,
      color,
    });
  }, [
    sessionId,
    customerId,
    palletNumber,
    model,
    type,
    vehicleTypeName,
    color,
    submit,
  ]);

  const vehicleTypeOptions = React.useMemo<VehicleOption[]>(() => {
    const optionsMap: Record<string, string> = {};
    vehicleList.forEach((item) => {
      const id = item.vehicleTypeId || item.id;
      const label = item.vehicleType || item.name || id;

      if (id && !optionsMap[id]) {
        optionsMap[id] = label;
      }
    });

    return Object.keys(optionsMap).map((id) => ({
      id,
      label: optionsMap[id],
    }));
  }, [vehicleList]);

  const selectedOption = vehicleTypeOptions.find((opt) => opt.id === type);
  const displayValue = selectedOption ? selectedOption.label : vehicleTypeName;

  return (
    <Modal>
      <Modal.Header title='CREATE VEHICLE' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Pallet Number'
              value={palletNumber}
              feedback={validation['palletNumber']}
              placeholder='Enter pallet number.'
              hasError={typeof validation['palletNumber'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setPalletNumber}
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Model'
              value={model}
              feedback={validation['model']}
              placeholder='Enter model.'
              hasError={typeof validation['model'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setModel}
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <ListInput
              className='w-100'
              label='Type'
              value={displayValue || undefined}
              placeholder={isLoadingVehicles ? "Loading..." : "Select type"}
              hasError={typeof validation["type"] !== "undefined" || typeof validation["vehicleTypeName"] !== "undefined"}
              isDisabled={isLoading || isSuccess || isLoadingVehicles}
            >
              {(onClose) => (
                <React.Fragment>
                  <ListInput.Item
                    label="None"
                    isActive={type === ""}
                    onClick={() => {
                      setType("");
                      setVehicleTypeName("");
                      onClose();
                    }}
                  />
                  <Map
                    items={vehicleTypeOptions}
                    renderItem={(item: VehicleOption) => (
                      <ListInput.Item
                        key={item.id}
                        label={item.label}
                        isActive={type === item.id}
                        onClick={() => {
                          setType(item.id);              // Sets Vehicle ID to 'type'
                          setVehicleTypeName(item.label); // Sets Vehicle Name to 'vehicleTypeName'
                          onClose();
                        }}
                      />
                    )}
                  />
                </React.Fragment>
              )}
            </ListInput>
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Color'
              value={color}
              feedback={validation['color']}
              placeholder='Enter color.'
              hasError={typeof validation['color'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setColor}
            />
          </Grid.Cell>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.DEFAULT}
          label='CREATE'
          icon={isLoading ? <SpinnerIcon /> : <PlusIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={handleSubmit}
        />
        <Button
          label='CLOSE'
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

const delayAfterSuccess = 2000;
