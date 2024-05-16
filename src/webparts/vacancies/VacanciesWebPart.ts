import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'VacanciesWebPartStrings';
import Vacancies from './components/Vacancies';
import { IVacanciesProps } from './components/IVacanciesProps';

export interface IVacanciesWebPartProps {
  
}

export default class VacanciesWebPart extends BaseClientSideWebPart<IVacanciesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IVacanciesProps> = React.createElement(
      Vacancies,
      {

      }
    );

    ReactDom.render(element, this.domElement);
  }

  // protected onInit(): Promise<void> {
  //   return console.log('hello world');
  // }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
