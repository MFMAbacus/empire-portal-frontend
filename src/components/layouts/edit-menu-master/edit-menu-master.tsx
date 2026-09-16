import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { NumberInput } from "@/components/base/number-input";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { makeGetMenuMasterService } from "@/services/get-menu-master-service";
import { makeCreateMenuMasterService } from "@/services/create-menu-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";

type EditMenuMasterProps = {
  sessionId: string;
  menuId: string; // Database Record ID
  onBack: () => void;
};

type VenueMasterItem = {
  id?: string;
  venueId?: string;
  venueName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditMenuMaster = ({
  sessionId,
  menuId,
  onBack,
}: EditMenuMasterProps): JSX.Element => {
  // User editable input state for Menu ID/Code
  const [menuCode, setMenuCode] = React.useState<string>("");
  const [menuName, setMenuName] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [menuItem, setMenuItem] = React.useState<string>("");
  const [venueId, setVenueId] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Venue Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetVenueMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: VenueMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setVenueList(items);
        }
      } catch (err) {
        console.error("Failed to fetch Venue master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
      propertyService.abort();
    };
  }, [sessionId]);

  // Initial Menu Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getMenuService = makeGetMenuMasterService();
    getMenuService
      .execute({ sessionId, menuId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setMenuCode(item.menuId || item.id || "");
          setMenuName(item.menuName || "");
          setPrice(item.price || "");
          setMenuItem(item.menuItem || "");
          setVenueId(item.venueId || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch menu details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, menuId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateMenuMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: menuId, // Target Record Primary Key
      menuId: menuCode, // User Input Field Value
      menuName,
      price,
      menuItem,
      venueId,
      isActive,
    } as any);
  }, [
    sessionId,
    menuId,
    menuCode,
    menuName,
    price,
    menuItem,
    venueId,
    isActive,
    submit,
  ]);

  // Extract unique venue for dropdown options
  const uniqueVenues = React.useMemo(() => {
    const codes = venueList
      .map((item) => item.venueId)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [venueList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT MENU MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !menuCode ||
            !menuName ||
            !menuItem ||
            !venueId ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading menu details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

            <Paper.Title value={`Menu Details (ID: ${menuId})`} />

            <Grid>
              {/* Field 1: Menu ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Menu ID"
                  placeholder="Enter menu ID"
                  value={menuCode}
                  hasError={typeof validation["menuId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setMenuCode}
                />
              </Grid.Cell>
              {/* Field 2: Menu No. */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Menu Name."
                  placeholder="Enter Memnu name"
                  value={menuName}
                  hasError={typeof validation["menuName"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setMenuName}
                />
              </Grid.Cell>
              {/* Field 5: venueId (ListInput Dropdown) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Venue ID"
                  value={venueId || undefined}
                  placeholder={
                    isLoadingProperties ? "Loading..." : "Select venue Id"
                  }
                  hasError={typeof validation["venueId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingProperties}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={venueId === ""}
                        onClick={() => {
                          setVenueId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueVenues}
                        renderItem={(code) => (
                          <ListInput.Item
                            key={code}
                            label={code}
                            isActive={venueId === code}
                            onClick={() => {
                              setVenueId(code);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
              {/* Field 4: price */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <NumberInput
                  className="w-100"
                  label="Price "
                  placeholder="Enter price"
                  value={price.toString()}
                  hasError={typeof validation["price"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setPrice(parseInt(value) || 0)}
                />
              </Grid.Cell>
              </Grid>
              <Grid>
              {/* Field 3: menu item */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Menu Item"
                  placeholder="Enter Menu Item"
                  value={menuItem}
                  hasError={typeof validation["menuItem"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setMenuItem}
                />
              </Grid.Cell>
              {/* Status Checkbox */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  className="mt-2"
                  label="Active"
                  isChecked={isActive}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsActive}
                />
              </Grid.Cell>
            </Grid>
          </Paper>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
