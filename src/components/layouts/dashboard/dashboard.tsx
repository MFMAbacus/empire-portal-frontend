import * as React from "react";

import cls from "./dashboard.module.scss";

type DashboardProps = {
  children: React.ReactNode;
};

type DashboardComponent = {
  (props: DashboardProps): JSX.Element;
  Page: typeof DashboardPage;
  Content: typeof DashboardContent;
};

export const Dashboard: DashboardComponent = ({
  children,
}: DashboardProps): JSX.Element => {
  return (
    <div className={cls["dashboard"]}>
      {/* <div className={cls["test_env"]}>Test Environment</div> */}
      {children}
    </div>
  );
};

type DashboardContentProps = {
  children: React.ReactNode;
};

export const DashboardContent = ({
  children,
}: DashboardContentProps): JSX.Element => {
  return <div className={cls["dashboard__content"]}>{children}</div>;
};

type DashboardPageProps = {
  children: React.ReactNode;
};

export const DashboardPage = ({
  children,
}: DashboardPageProps): JSX.Element => {
  return <div className={cls["dashboard__page"]}>{children}</div>;
};

Dashboard.Page = DashboardPage;
Dashboard.Content = DashboardContent;
