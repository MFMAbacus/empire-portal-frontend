import * as React from "react";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";

import { useClickAway } from "@/hooks/use-click-away";

import { UsePermissionContext } from "@/context/PermissionContext";
import logoPng from "@/assets/images/logo.png";

import { clsx } from "@/utility/clsx";

import cls from "./topbar.module.scss";

type TopbarProps = {
  children: React.ReactNode;
};

type TopbarComponent = {
  (props: TopbarProps): JSX.Element;
  Nav: typeof TopbarNav;
  NavItem: typeof TopbarNavItem;
  Menu: typeof TopbarMenu;
  MenuItem: typeof TopbarMenuItem;
};

export const Topbar: TopbarComponent = ({
  children,
}: TopbarProps): JSX.Element => {
  return <header className={cls["topbar"]}>{children}</header>;
};

type TopbaNavProps = {
  children: React.ReactNode;
};

const TopbarNav = ({ children }: TopbaNavProps): JSX.Element => {
  const scrollContainerRef = React.useRef<HTMLUListElement>(null);
  const dragStateRef = React.useRef<{
    isPointerDown: boolean;
    isDragging: boolean;
    startX: number;
    scrollLeft: number;
    shouldPreventClick: boolean;
  }>({
    isPointerDown: false,
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    shouldPreventClick: false,
  });
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(false);

  const updateScrollControls = React.useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScrollLeft = Math.max(
      0,
      container.scrollWidth - container.clientWidth
    );

    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
  }, []);

  const stopDragging = React.useCallback(() => {
    const dragState = dragStateRef.current;
    const container = scrollContainerRef.current;

    if (!dragState.isPointerDown && !dragState.isDragging) {
      return;
    }

    dragState.isPointerDown = false;

    if (dragState.isDragging) {
      dragState.isDragging = false;
      dragState.shouldPreventClick = true;

      if (container) {
        container.style.scrollBehavior = "";
        dragState.scrollLeft = container.scrollLeft;
      }

      setIsDragging(false);
    }

    updateScrollControls();
  }, [updateScrollControls]);

  const handlePointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    dragStateRef.current.isPointerDown = true;
    dragStateRef.current.isDragging = false;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.scrollLeft = container.scrollLeft;
    dragStateRef.current.shouldPreventClick = false;
  };

  const handleClickCapture = (
    event: React.MouseEvent<HTMLUListElement>
  ): void => {
    if (!dragStateRef.current.shouldPreventClick) {
      return;
    }

    dragStateRef.current.shouldPreventClick = false;
    event.stopPropagation();
    event.preventDefault();
  };

  const scrollByDirection = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const scrollDistance = container.clientWidth * 0.7;
    const nextPosition =
      direction === "left"
        ? container.scrollLeft - scrollDistance
        : container.scrollLeft + scrollDistance;

    container.scrollTo({
      left: nextPosition,
      behavior: "smooth",
    });

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        updateScrollControls();
      });
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return undefined;
    }

    updateScrollControls();

    const handleScroll = () => {
      updateScrollControls();
    };

    container.addEventListener("scroll", handleScroll);

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollControls();
      });

      resizeObserver.observe(container);
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
    };
  }, [updateScrollControls]);

  React.useEffect(() => {
    updateScrollControls();
  }, [children, updateScrollControls]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;

      if (!dragState.isPointerDown) {
        return;
      }

      const container = scrollContainerRef.current;

      if (!container) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;

      if (!dragState.isDragging) {
        if (Math.abs(deltaX) < 3) {
          return;
        }

        dragState.isDragging = true;
        dragState.shouldPreventClick = true;
        container.style.scrollBehavior = "auto";
        setIsDragging(true);
      }

      container.scrollLeft = dragState.scrollLeft - deltaX;
      event.preventDefault();
      updateScrollControls();
    };

    const handlePointerUp = () => {
      stopDragging();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      stopDragging();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [stopDragging, updateScrollControls]);

  const listCls = clsx([
    cls["topbar-nav__list"],
    isDragging && cls["topbar-nav__list--is-dragging"],
  ]);

  return (
    <div className={cls["topbar__left"]}>
      <img
        className={cls["topbar__logo"]}
        src={logoPng}
        alt="Empire World Logo"
      />
      <nav className={cls["topbar-nav"]}>
        <button
          type="button"
          className={clsx([
            cls["topbar-nav__control"],
            cls["topbar-nav__control--left"],
          ])}
          onClick={() => scrollByDirection("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll navigation left"
        >
          <ChevronLeftIcon className={cls["topbar-nav__control-icon"]} />
        </button>
        <div className={cls["topbar-nav__viewport"]}>
          <ul
            ref={scrollContainerRef}
            className={listCls}
            onPointerDown={handlePointerDown}
            onClickCapture={handleClickCapture}
          >
            {children}
          </ul>
        </div>
        <button
          type="button"
          className={clsx([
            cls["topbar-nav__control"],
            cls["topbar-nav__control--right"],
          ])}
          onClick={() => scrollByDirection("right")}
          disabled={!canScrollRight}
          aria-label="Scroll navigation right"
        >
          <ChevronRightIcon className={cls["topbar-nav__control-icon"]} />
        </button>
      </nav>
    </div>
  );
};

type TopbarNavItemProps = {
  title: string;
  id: string;
  isAccess: boolean;
  isActive?: boolean;
  onClick?: () => void;
};

const TopbarNavItem = ({
  title,
  id,
  isAccess = false,
  isActive = false,
  onClick,
}: TopbarNavItemProps): JSX.Element => {
  const rootCls = clsx([
    cls["topbar-nav__item"],
    isActive && cls["topbar-nav__item--is-active"],
  ]);

  const { permissions } = UsePermissionContext();

  if (!isAccess) {
    return <></>;
  }

  return (
    <li className={rootCls}>
      <button className={cls["topbar-nav__button"]} onClick={onClick}>
        {title}
      </button>
    </li>
  );
};

type TopbarMenuProps = {
  firstName: string;
  lastName: string;
  role: string;
  children: React.ReactNode;
};

const TopbarMenu = ({
  firstName,
  lastName,
  role,
  children,
}: TopbarMenuProps): JSX.Element => {
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const handleClickAway = React.useCallback(() => {
    setIsActive(false);
  }, []);

  const { ref: clickAwayRef } = useClickAway<HTMLDivElement>({
    isActive,
    onClickAway: handleClickAway,
  });

  const toggleIsActive = () => {
    setIsActive((isActive) => !isActive);
  };

  const rootCls = clsx([
    cls["topbar-account"],
    isActive && cls["topbar-account--is-active"],
  ]);

  return (
    <div ref={clickAwayRef} className={rootCls}>
      <button
        className={cls["topbar-account__toggle"]}
        onClick={toggleIsActive}
      >
        <div className={cls["topbar-account__avatar"]}>
          {firstName[0] + lastName[0]}
        </div>
        <div className={cls["topbar-account__info"]}>
          <div className={cls["topbar-account__name"]}>
            {firstName} {lastName}
          </div>
          <div className={cls["topbar-account__role"]}>
            {role && `${role[0]?.toUpperCase() + role.slice(1)}`}
          </div>
        </div>
        <ChevronDownIcon className={cls["topbar-account__chevron"]} />
      </button>
      <div className={cls["topbar-account__popup"]}>
        <ul className={cls["topbar-account__popup-list"]}>{children}</ul>
      </div>
    </div>
  );
};

type TopbarMenuItemProps = {
  icon?: React.ReactNode;
  title: string;
  onClick: () => void;
};

const TopbarMenuItem = ({
  icon,
  title,
  onClick,
}: TopbarMenuItemProps): JSX.Element => {
  return (
    <li className={cls["topbar-account__popup-item"]}>
      <button className={cls["topbar-account__popup-button"]} onClick={onClick}>
        {typeof icon !== "undefined" && (
          <div className={cls["topbar-account__popup-icon"]}>{icon}</div>
        )}
        <span className={cls["topbar-account__popup-title"]}>{title}</span>
      </button>
    </li>
  );
};

Topbar.Nav = TopbarNav;
Topbar.NavItem = TopbarNavItem;
Topbar.Menu = TopbarMenu;
Topbar.MenuItem = TopbarMenuItem;
