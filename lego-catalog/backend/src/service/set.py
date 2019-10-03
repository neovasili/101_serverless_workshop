import json

from src.model.set import Set

class SetService( object ):

  def __init__( self, sets_items ):
    self.__sets_items = []

    for set_item in sets_items:
      incoming_set = Set( json.dumps( set_item ) )

      self.__sets_items.append( incoming_set )

  def __str__( self ):pass

  def get_set_by_element( self, set_item ):
    received_set_item = Set( set_item )

    for set_element in self.__sets_items:
      if set_element == received_set_item:
        return str( set_element ) 
    
    return None

  def get_set_by_reference( self, set_id ):
    item_search = {}
    item_search[ "setReference" ] = set_id

    return self.get_set_by_element( json.dumps( item_search ) )