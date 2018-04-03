import { ThingBuilder } from './models/Thing';
import { ThingRequest } from '../../api/v1/ThingsController';

export class ThingCreator {
  public assignPropertiesToBuilder(addThingRequest: ThingRequest): ThingBuilder {
    const thingBuilder = new ThingBuilder();

    thingBuilder.description = addThingRequest.description;

    return thingBuilder;
  }
}
